// Visual regression helper for risky CSS changes (e.g. the Tailwind v4
// migration, #178). It serves the built `dist/` folder, then for every page,
// viewport and color scheme it saves a full-page screenshot plus the computed
// styles of every element. Diffing two style dumps pinpoints exactly what
// changed ("h2 line-height: 40px -> 45px") instead of eyeballing pixels.
//
//   yarn build && yarn snapshots capture .visual-snapshots/before
//   ...make changes...
//   yarn build && yarn snapshots capture .visual-snapshots/after
//   yarn snapshots compare .visual-snapshots/before .visual-snapshots/after
import { createServer } from 'node:http'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const distDir = path.resolve('dist')

const viewports = {
  mobile: { width: 375, height: 812 },
  desktop: { width: 1280, height: 800 },
}
const colorSchemes = ['light', 'dark']

// Properties that Tailwind utilities (and our @apply rules) can affect.
const styleProps = [
  'display', 'position', 'float', 'box-sizing', 'width', 'height',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-top-style', 'border-bottom-style',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'border-radius', 'color', 'background-color', 'opacity',
  'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing',
  'text-align', 'text-transform', 'text-decoration-line', 'text-decoration-color',
  'list-style-type', 'list-style-position', 'border-collapse', 'overflow-x',
  'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'gap',
  'cursor', 'outline-style',
]

const contentTypes = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml',
}

function listPages(dir, base = dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) return listPages(full, base)
    if (!name.endsWith('.html')) return []
    const rel = path.relative(base, full).replace(/index\.html$/, '').replace(/\.html$/, '')
    return [`/${rel}`]
  })
}

function serveDist() {
  const server = createServer(async (req, res) => {
    let file = path.join(distDir, decodeURIComponent(new URL(req.url, 'http://x').pathname))
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html')
    else if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`
    try {
      const body = await readFile(file)
      res.writeHead(200, { 'content-type': contentTypes[path.extname(file)] ?? 'application/octet-stream' })
      res.end(body)
    } catch {
      res.writeHead(404).end()
    }
  })
  return new Promise((resolve) => server.listen(0, () => resolve(server)))
}

async function capture(outDir) {
  if (!existsSync(distDir)) throw new Error('dist/ not found, run `yarn build` first')

  const pages = listPages(distDir).sort()
  const server = await serveDist()
  const origin = `http://localhost:${server.address().port}`
  const browser = await chromium.launch()
  const styles = {}

  for (const [viewportName, viewport] of Object.entries(viewports)) {
    for (const colorScheme of colorSchemes) {
      const variant = `${viewportName}-${colorScheme}`
      const context = await browser.newContext({ viewport, colorScheme })
      const page = await context.newPage()
      await mkdir(path.join(outDir, variant), { recursive: true })

      for (const pagePath of pages) {
        await page.goto(origin + pagePath, { waitUntil: 'networkidle' })
        await page.evaluate(() => document.fonts.ready)

        const name = pagePath === '/' ? 'index' : pagePath.slice(1).replace(/\/$/, '').replaceAll('/', '__')
        await page.screenshot({ path: path.join(outDir, variant, `${name}.png`), fullPage: true })

        styles[`${variant} ${pagePath}`] = await page.evaluate((props) => {
          const keyFor = (el) => {
            const parts = []
            for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
              const index = [...node.parentElement.children].indexOf(node) + 1
              parts.unshift(`${node.tagName.toLowerCase()}:nth-child(${index})`)
            }
            return parts.join('>')
          }
          const result = {}
          for (const el of document.body.querySelectorAll('*')) {
            const computed = getComputedStyle(el)
            result[keyFor(el)] = {
              label: `${el.tagName.toLowerCase()}${el.classList.length ? `.${[...el.classList].join('.')}` : ''}`,
              styles: Object.fromEntries(props.map((prop) => [prop, computed.getPropertyValue(prop)])),
            }
          }
          return result
        }, styleProps)
      }

      await context.close()
    }
  }

  await browser.close()
  server.close()
  await writeFile(path.join(outDir, 'styles.json'), JSON.stringify(styles))
  console.log(`[snapshots] captured ${pages.length} pages x ${Object.keys(styles).length / pages.length} variants into ${outDir}`)
}

async function compare(beforeDir, afterDir) {
  const before = JSON.parse(await readFile(path.join(beforeDir, 'styles.json'), 'utf8'))
  const after = JSON.parse(await readFile(path.join(afterDir, 'styles.json'), 'utf8'))

  // The same change usually repeats across many elements/pages/variants, so
  // group by (element label, property, before, after) and report counts.
  const changes = new Map()
  const structural = []

  for (const [pageKey, beforeElements] of Object.entries(before)) {
    const afterElements = after[pageKey]
    if (!afterElements) {
      structural.push(`page missing: ${pageKey}`)
      continue
    }
    for (const [elementKey, { label, styles }] of Object.entries(beforeElements)) {
      const afterElement = afterElements[elementKey]
      if (!afterElement) {
        structural.push(`element missing: ${pageKey} ${label} (${elementKey})`)
        continue
      }
      for (const [prop, value] of Object.entries(styles)) {
        const newValue = afterElement.styles[prop]
        if (value === newValue) continue
        const key = `${label} | ${prop}: ${value} -> ${newValue}`
        const entry = changes.get(key) ?? { count: 0, example: `${pageKey}` }
        entry.count += 1
        changes.set(key, entry)
      }
    }
  }

  for (const line of structural) console.log(line)
  const sorted = [...changes.entries()].sort((a, b) => b[1].count - a[1].count)
  for (const [key, { count, example }] of sorted) console.log(`${String(count).padStart(5)}x  ${key}  (e.g. ${example})`)

  const total = sorted.length + structural.length
  console.log(total === 0 ? '[snapshots] no computed style differences' : `[snapshots] ${total} distinct differences`)
  process.exitCode = total === 0 ? 0 : 1
}

const [command, ...args] = process.argv.slice(2)
if (command === 'capture' && args.length === 1) await capture(path.resolve(args[0]))
else if (command === 'compare' && args.length === 2) await compare(path.resolve(args[0]), path.resolve(args[1]))
else {
  console.error('usage: visual-snapshots.mjs capture <dir> | compare <before-dir> <after-dir>')
  process.exitCode = 2
}
