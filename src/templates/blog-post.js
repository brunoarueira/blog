import React from 'react'
import { Link, graphql } from 'gatsby'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import tw, { styled } from 'twin.macro'
import { Disqus } from 'gatsby-plugin-disqus'

import Layout from '../components/layout'
import SEO from '../components/seo'
import SocialShare from '../components/social_share'
import ReadTime from '../components/read_time'
import iconProps from '../components/icon_props'
import Icon from '../components/icon'
import { MoveChevronStyle } from '../components/shared_styles'

const StyledUl = styled.ul`
  ${tw`flex flex-row justify-between`}

  liststyle: 'none';
`

const Info = styled.div`
  ${tw`w-full flex items-center mt-0 mb-8 text-gray-600`}

  font-weight: 300;

  time {
    ${tw`mr-1`}
  }
`

const StyledLink = styled(Link)`
  ${MoveChevronStyle}
`

const BlogPostTemplate = ({ data, pageContext, location, children }) => {
  const {
    mdx: post,
    site: {
      siteMetadata: { siteUrl },
    },
  } = data
  const { previous, next } = pageContext
  const postSlug = `/blog/${post.frontmatter.slug}`
  const disqusConfig = {
    url: `${siteUrl}${postSlug}`,
    identifier: post.frontmatter.title,
    title: post.frontmatter.title,
  }

  return (
    <Layout location={location}>
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        image={post.fields.socialImage.childImageSharp.original.src}
        slug={postSlug}
        keywords={post.frontmatter.keywords || []}
      />

      <h1 className="mb-8 mt-6">{post.frontmatter.title}</h1>

      <Info>
        <time dateTime={post.frontmatter.date}>{post.frontmatter.fullDate}</time>
        {` `}|{` `}
        <ReadTime time={post.timeToRead} />
      </Info>

      {children}

      <SocialShare title={post.frontmatter.title} path={postSlug} />

      <hr className="mt-6 mb-4" />

      <StyledUl>
        <li>
          {previous && (
            <StyledLink to={`../../blog/${previous.frontmatter.slug}`} rel="prev" direction="left">
              <Icon>
                <FiChevronLeft size={14} {...iconProps} />
              </Icon>
              {previous.frontmatter.title}
            </StyledLink>
          )}
        </li>
        <li>
          {next && (
            <StyledLink to={`../../blog/${next.frontmatter.slug}`} rel="next">
              {next.frontmatter.title}
              <Icon>
                <FiChevronRight size={14} {...iconProps} />
              </Icon>
            </StyledLink>
          )}
        </li>
      </StyledUl>

      <Disqus config={disqusConfig} />
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query ($slug: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    mdx(frontmatter: { slug: { eq: $slug } }) {
      id
      timeToRead
      excerpt(pruneLength: 160)
      fields {
        socialImage {
          childImageSharp {
            original {
              width
              height
              src
            }
          }
        }
      }
      frontmatter {
        title
        slug
        keywords
        date(formatString: "YYYY-MM-DD")
        fullDate: date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
