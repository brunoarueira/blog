// Renders ```mermaid code blocks to <img> tags with an inline SVG data URI at
// build time, so pages ship no Mermaid JavaScript. Replaces rehype-mermaid +
// mermaid-isomorphic (stuck on mermaid@11 and a vulnerable katex, see #233),
// keeping only what this blog uses: their `img-svg` strategy.
import { fileURLToPath } from 'node:url';
import svgToDataURI from 'mini-svg-data-uri';
import { chromium } from 'playwright';

const mermaidScript = fileURLToPath(import.meta.resolve('mermaid/dist/mermaid.min.js'));

function isMermaidCode(node) {
  const className = node.properties?.className;
  return node.tagName === 'code' && Array.isArray(className) && className.includes('language-mermaid');
}

function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children || []).map(textOf).join('');
}

// Collects <pre> elements whose only non-blank child is a mermaid <code>.
function findDiagrams(node, found = []) {
  for (const child of node.children || []) {
    if (child.type !== 'element') continue;
    if (child.tagName === 'pre') {
      const elements = child.children.filter((c) => c.type !== 'text' || /\S/.test(c.value));
      if (elements.length === 1 && isMermaidCode(elements[0])) {
        found.push({ parent: node, pre: child, diagram: textOf(elements[0]) });
        continue;
      }
    }
    findDiagrams(child, found);
  }
  return found;
}

// Runs in the browser. Mirrors mermaid-isomorphic so the output matches it.
async function renderInBrowser(diagrams) {
  const container = document.createElement('div');
  Object.assign(container.style, { maxHeight: '0', opacity: '0', overflow: 'hidden' });
  document.body.append(container);
  // mermaid@12 switched to ELK layout, a new default look and narrower label
  // wrapping (120px); keep the mermaid@11 rendering the posts were written
  // against.
  mermaid.initialize({
    fontFamily: 'arial,sans-serif',
    layout: 'dagre',
    theme: 'default',
    look: 'classic',
    flowchart: { wrappingWidth: 200 },
  });

  const ariaText = (svg, attribute) =>
    (svg.getAttribute(attribute) || '')
      .split(/\s+/)
      .map((id) => (id && svg.querySelector(`#${CSS.escape(id)}`)?.textContent) || '')
      .join('');

  const results = [];
  for (const [index, diagram] of diagrams.entries()) {
    const id = `mermaid-${index}`;
    const { svg } = await mermaid.render(id, diagram, container);
    const element = new DOMParser().parseFromString(svg, 'text/html').querySelector('svg');
    const { width, height } = element.viewBox.baseVal;
    results.push({
      id,
      width,
      height,
      title: ariaText(element, 'aria-labelledby') || undefined,
      alt: ariaText(element, 'aria-describedby'),
      svg: new XMLSerializer().serializeToString(element),
    });
  }
  return results;
}

export function rehypeMermaid() {
  return async function (tree, file) {
    const found = findDiagrams(tree);
    if (!found.length) return;

    const browser = await chromium.launch();
    let results;
    try {
      const page = await browser.newPage();
      await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');
      await page.addScriptTag({ path: mermaidScript });
      results = await page.evaluate(renderInBrowser, found.map(({ diagram }) => diagram));
    } catch (error) {
      file.fail(`Failed to render mermaid diagram: ${error.message}`, { source: 'rehype-mermaid' });
    } finally {
      await browser.close();
    }

    for (const [index, { parent, pre }] of found.entries()) {
      const { svg, ...attributes } = results[index];
      parent.children[parent.children.indexOf(pre)] = {
        type: 'element',
        tagName: 'img',
        properties: { ...attributes, src: svgToDataURI(svg) },
        children: [],
      };
    }
  };
}
