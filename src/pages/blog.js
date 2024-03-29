import React from 'react'
import { Link, graphql } from 'gatsby'
import { FiChevronRight } from 'react-icons/fi'
import tw, { styled } from 'twin.macro'

import tailwindConfig from '../utils/tailwindConfig'

import Layout from '../components/Layout'
import SEO from '../components/seo'
import Icon from '../components/icon'
import iconProps from '../components/icon_props'
import { MoveChevronStyle } from '../components/shared_styles'

import StyledLink from '../components/styled_link'

const { theme } = tailwindConfig

const PostLink = styled(Link)`
  font-weight: 700;
  box-shadow: none;
`

const Date = styled.small`
  ${tw`text-gray-600`}

  font-weight: 400;
`

const Index = ({ location, data }) => {
  const posts = data ? data.allMdx.edges : []

  return (
    <Layout location={location}>
      <SEO
        title="My blog posts where you can check out my writings"
        description="My blog posts where you can check out my writings"
      />

      <h1 className="leading-tight mb-8 mt-6">Blog</h1>

      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.frontmatter.slug

        const postSlug = `/blog/${node.frontmatter.slug}`

        return (
          <div key={postSlug} className="mb-12">
            <h2 className="mb-3">
              <PostLink to={postSlug}>{title}</PostLink>
            </h2>

            <Date>{node.frontmatter.date}</Date>

            <p
              className="mt-5"
              dangerouslySetInnerHTML={{ __html: node.excerpt }}
            />

            <div className="flex flex-col md:flex-row items-left md:items-center justify-between mt-5">
              <StyledLink to={postSlug}>
                Read more
                <Icon>
                  <FiChevronRight size={14} {...iconProps} />
                </Icon>
              </StyledLink>
            </div>
          </div>
        )
      })}
    </Layout>
  )
}

export default Index

export const pageQuery = graphql`
  query {
    allMdx(filter: { fields: { sourceName: { eq: "blog" } } }, sort: { frontmatter: { date: DESC }}) {
      edges {
        node {
          excerpt(pruneLength: 300)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            slug
            title
          }
        }
      }
    }
  }
`
