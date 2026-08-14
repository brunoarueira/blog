// Some crawlers request /sitemap.xml by convention, without reading
// robots.txt first. @astrojs/sitemap always writes sitemap-index.xml
// (see https://github.com/withastro/astro/pull/11898, closed unmerged),
// so we mirror that file to sitemap.xml after the build. Both URLs then
// serve the same valid sitemap-index XML document.
import { copyFile } from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve('dist')
const source = path.join(distDir, 'sitemap-index.xml')
const dest = path.join(distDir, 'sitemap.xml')

await copyFile(source, dest)
console.log('[alias-sitemap] copied sitemap-index.xml -> sitemap.xml')
