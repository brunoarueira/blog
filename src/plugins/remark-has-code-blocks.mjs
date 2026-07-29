function containsCode(node) {
  if (node.type === 'code') return true;
  return (node.children || []).some(containsCode);
}

export function remarkHasCodeBlocks() {
  return function (tree, { data }) {
    data.astro.frontmatter.hasCodeBlocks = containsCode(tree);
  };
}
