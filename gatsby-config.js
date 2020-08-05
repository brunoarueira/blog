const renderCard = ({ title }) =>
  `<head><link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap" rel="stylesheet" /><link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap" rel="stylesheet" /></head><body style="margin:0"><div style="background-color: #FFD700;width:1080px;height:510px;padding:60px;display: flex;flex-direction: row;justify-content: center;"><div style="display: flex;flex-direction: column;justify-content: center; align-content: center;"><p style="font-family:'Source Sans Pro';font-size: 72px;font-weight: 700;">${title}</p></div></div></body>`

const development = process.env.GATSBY_ENV === 'development'

module.exports = {
  siteMetadata: {
    title: `Bruno Arueira`,
    description: `Bruno Arueira is a software developer. He works actually on a full stack environment with ruby and nodejs as backend, and primarly with react on the frontend, but also knows html, css and vanilla js aswell. Besides that, he also knows a bit about DevOps.`,
    author: `@bruno_arueira`,
    siteUrl: `https://brunoarueira.com/`,
  },
  plugins: [
    `gatsby-plugin-postcss`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true, // Print removed selectors and processed file names
        develop: development, // Enable while using `gatsby develop`
        tailwind: true, // Enable tailwindcss support
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/content/assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/content/blog`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: ['.mdx', '.md'],

        defaultLayouts: {
          default: require.resolve('./src/components/Layout.js'),
        },

        // a workaround to solve mdx-remark plugin compat issue
        // https://github.com/gatsbyjs/gatsby/issues/15486
        plugins: [`gatsby-remark-images`, `gatsby-remark-prismjs`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              linkImagesToOriginal: false,
              showCaptions: ['alt'],
            },
          },

          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },

          {
            resolve: `gatsby-remark-copy-linked-files`,
          },

          {
            resolve: `gatsby-remark-smartypants`,
          },

          {
            resolve: `gatsby-remark-external-links`,
            options: {
              target: '_blank',
              rel: 'noopener noreferrer',
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-remark-social-image',
      options: { design: renderCard },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-15724292-2`,
        head: false,
        anonymize: true,
        respectDNT: true,
        defer: true,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  excerpt: edge.node.excerpt,
                  url: `${site.siteMetadata.siteUrl}/blog/${edge.node.frontmatter.slug}`,
                  guid: `${site.siteMetadata.siteUrl}/blog/${edge.node.frontmatter.slug}`,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                })
              })
            },

            /* if you want to filter for only published posts, you can do
             * something like this:
             * filter: { frontmatter: { published: { ne: false } } }
             * just make sure to add a published frontmatter field to all posts,
             * otherwise gatsby will complain
             **/
            query: `
            {
              allMdx(
                limit: 1000,
                sort: { order: DESC, fields: [frontmatter___date] },
              ) {
                edges {
                  node {
                    fields { slug }
                    excerpt
                    frontmatter {
                      title
                      slug
                      date
                    }
                    html
                  }
                }
              }
            }
            `,
            output: '/feed.xml',
            title: 'Bruno Arueira RSS feed',
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Bruno Arueira`,
        short_name: `Bruno Arueira`,
        start_url: `/`,
        background_color: `#FFD700`,
        theme_color: `#FFD700`,
        display: `minimal-ui`,
        icon: `content/assets/logo.png`,
      },
    },
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `brunoarueira-com`,
      },
    },
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-offline`,
  ],
}
