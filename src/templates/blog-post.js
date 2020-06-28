import React from 'react'
import { Link, graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import styled from 'styled-components'
import tw from 'tailwind.macro'

import Layout from '../components/Layout'
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

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.mdx
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location}>
        <SEO title={post.frontmatter.title} description={post.excerpt} />

        <h1 className="mb-1 mt-4">{post.frontmatter.title}</h1>

        <Info>
          <time dateTime={post.frontmatter.date}>
            {post.frontmatter.fullDate}
          </time>
          {` `}|{` `}
          <ReadTime time={post.timeToRead} />
        </Info>

        <MDXRenderer>{post.body}</MDXRenderer>

        <SocialShare title={post.frontmatter.title} path={post.fields.slug} />

        <hr className="mt-6 mb-4" />

        <StyledUl>
          <li>
            {previous && (
              <StyledLink to={previous.fields.slug} rel="prev" direction="left">
                <Icon>
                  <FiChevronLeft size={14} {...iconProps} />
                </Icon>
                {previous.frontmatter.title}
              </StyledLink>
            )}
          </li>
          <li>
            {next && (
              <StyledLink to={next.fields.slug} rel="next">
                {next.frontmatter.title}
                <Icon>
                  <FiChevronRight size={14} {...iconProps} />
                </Icon>
              </StyledLink>
            )}
          </li>
        </StyledUl>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
      timeToRead
      excerpt(pruneLength: 160)
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        fullDate: date(formatString: "MMMM DD, YYYY")
      }
      body
    }
  }
`
