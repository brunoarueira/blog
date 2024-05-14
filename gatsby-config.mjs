import remarkGfm from 'remark-gfm'
import remarkExternalLinks from 'remark-external-links'
import { dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const renderCard = ({ title }) =>
  `<head><link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap" rel="stylesheet" /><link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap" rel="stylesheet" /></head><body style="margin:0"><div style="background-color: #FFD700;width:1080px;height:510px;padding:60px;display: flex;flex-direction: row;justify-content: center;"><div style="display: flex;flex-direction: column;justify-content: center; align-content: center;"><p style="font-family:'Source Sans Pro';font-size: 72px;font-weight: 700;">${title}</p></div></div></body>`

const config = {
  siteMetadata: {
    title: `Bruno Arueira`,
    description: `Bruno Arueira is a Tech Lead, lately working mostly with ruby, rails, nodejs and react. Besides that, he also knows a bit about DevOps.`,
    author: `@bruno_arueira`,
    siteUrl: `https://brunoarueira.com/`,
  },
  flags: {
    PRESERVE_WEBPACK_CACHE: true,
    PARALLEL_SOURCING: true,
  },
  plugins: [
    `gatsby-plugin-postcss`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true, // Print removed selectors and processed file names
        develop: true, // Enable while using `gatsby develop`
        tailwind: true, // Enable tailwindcss support
        purgeCSSOptions: {
          safelist: ['ol', 'ul', 'footnotes', 'code', 'prism-code'],
        },
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
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },

    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: ['.mdx', '.md'],
        mdxOptions: {
          remarkPlugins: [
            remarkGfm,
            [
              remarkExternalLinks,
              {
                target: '_blank',
                rel: 'noopener noreferrer',
              }
            ],
          ],

          remarkRehypeOptions: {
            allowDangerousHtml: true,
            footnoteLabel: ' ',
          },
        },

        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              linkImagesToOriginal: false,
              showCaptions: true,
              markdownCaptions: true,
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
        ],
      },
    },
    {
      resolve: 'gatsby-remark-social-image',
      options: { design: renderCard },
    },

    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-catch-links`,
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
              return allMdx.edges.map((edge) => {
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
                filter: { fields: { sourceName: { eq: "blog" } } },
                sort: { frontmatter: { date: DESC }},
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
            site_url: 'https://www.brunoarueira.com',
            generator: 'Bruno Arueira',
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

export default config;
