const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const readingTime = require(`reading-time`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  return graphql(`
    {
      allMdx(sort: { frontmatter: { date: DESC } }, limit: 1000) {
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
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: `blog/${post.node.frontmatter.slug}`,
        component: `${blogPost}?__contentFilePath=${post.node.internal.contentFilePath}`,
        context: {
          slug: post.node.frontmatter.slug,
          previous,
          next,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
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

    if (parent.internal.type === `File`) {
      createNodeField({
        name: `sourceName`,
        node,
        value: parent.sourceInstanceName,
      })
    }
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`#graphql
    type Mdx implements Node {
      timeToRead: Float @proxy(from: "fields.timeToRead.minutes")
    }
  `)
}

exports.onCreateWebpackConfig = ({ getConfig, actions }) => {
  let config = {
    resolve: {
      fallback: {
        path: require.resolve('path-browserify'),
        util: require.resolve('util/'),
      },
    },
  }

  if (getConfig().mode === 'production') {
    config.devtool = false
  }

  actions.setWebpackConfig(config)
}
