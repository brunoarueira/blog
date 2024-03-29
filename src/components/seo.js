import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

const FALLBACK_IMAGE = '/default-social-card.png'

const SEO = ({ description, lang, meta, keywords, title, slug, image }) => {
  const {
    site: { siteMetadata },
  } = useStaticQuery(detailsQuery)

  const metaDescription = description || siteMetadata.description
  const ogImage = `${siteMetadata.siteUrl}${image || FALLBACK_IMAGE}`
  const url = `${siteMetadata.siteUrl}/${slug || ''}`

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      titleTemplate={`%s | ${siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:url`,
          content: url,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `article`,
        },
        {
          property: `og:image`,
          content: ogImage,
        },
        {
          property: `og:image:width`,
          content: 2048,
        },
        {
          property: `og:image:height`,
          content: 1170,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:creator`,
          content: siteMetadata.author,
        },
        {
          name: `twitter:site`,
          content: siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          property: `twitter:image`,
          content: ogImage,
        },
        {
          property: `twitter:image:width`,
          content: 2048,
        },
        {
          property: `twitter:image:height`,
          content: 1170,
        },
      ]
        .concat(
          keywords.length > 0
            ? {
                name: `keywords`,
                content: keywords.join(`, `),
              }
            : []
        )
        .concat(meta)}
    >
      <link href="https://fonts.gstatic.com" rel="preconnect" cross-origin />
      <link
        href="https://fonts.googleapis.com/css?family=Source+Code+Pro:200,600|Source+Sans+Pro:300,400,500,600,700&display=swap"
        rel="stylesheet"
        media="print"
        onload="this.media='all'"
      />
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  keywords: [],
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
}

export default SEO

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        siteUrl
        description
        author
      }
    }
  }
`
