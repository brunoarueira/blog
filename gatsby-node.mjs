import path from 'path'
import { createFilePath } from 'gatsby-source-filesystem'
import readingTime from 'reading-time'
import { renderToString } from 'react-dom/server'
import remarkGfm from 'remark-gfm'
import remarkExternalLinks from 'remark-external-links'
import * as runtime from 'react/jsx-runtime'
import { compile, runSync } from '@mdx-js/mdx'

export const createPages = ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const blogPostTemplate = path.resolve(`./src/templates/blog-post.js`)

  return graphql(`
    {
      allMdx(filter: { fields: { sourceName: { eq: "blog" } } }, sort: { frontmatter: { date: DESC } }, limit: 1000) {
        edges {
          node {
            id
            frontmatter {
              title
              slug
            }
            internal {
              contentFilePath
            }
            body
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      reporter.panicOnBuild('Error loading MDX result', result.errors)
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: `blog/${post.node.frontmatter.slug}`,
        component: `${blogPostTemplate}?__contentFilePath=${post.node.internal.contentFilePath}`,
        context: {
          slug: post.node.frontmatter.slug,
          previous,
          next,
        },
      })
    })
  })
}

export const onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    const parent = getNode(node.parent)

    createNodeField({
      node,
      name: `timeToRead`,
      value: readingTime(node.body),
    })

    createNodeField({
      name: `slug`,
      node,
      value,
    })

    if (parent.sourceInstanceName == 'blog') {
      console.log('META', node.body)

      compile(node.body, {
        outputFormat: 'function-body',
        remarkPlugins: [
          remarkGfm,
          [
            remarkExternalLinks,
            {
              target: '_blank',
              rel: 'noopener noreferrer',
            }
          ]
        ],
        remarkRehypeOptions: {
          allowDangerousHtml: true,
          footnoteLabel: ' ',
        },
        useDynamicImport: true
      }).then((result) => {
          const { default: MDXContent } = runSync(result, { ...runtime, baseUrl: import.meta.url })

          createNodeField({
            name: `html`,
            node,
            value: renderToString(MDXContent())
          })
        })
    }

    if (parent.internal.type === `File`) {
      createNodeField({
        name: `sourceName`,
        node,
        value: parent.sourceInstanceName,
      })
    }
  }
}

export const createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`#graphql
    type Mdx implements Node {
      timeToRead: Float @proxy(from: "fields.timeToRead.minutes")
      html: String @proxy(from: "fields.html")
    }
  `)
}

export const onCreateWebpackConfig = ({ getConfig, actions }) => {
  let config = {
    // resolve: {
    //   fallback: {
    //     path: require.resolve('path-browserify'),
    //     util: require.resolve('util/'),
    //   },
    // },
  }

  if (getConfig().mode === 'production') {
    config.devtool = false
  }

  actions.setWebpackConfig(config)
}
