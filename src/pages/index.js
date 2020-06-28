import React from 'react'
import { Link, graphql } from 'gatsby'
import styled from 'styled-components'
import tw from 'tailwind.macro'

import Layout from '../components/Layout'
import SEO from '../components/seo'
import Writings from '../components/writings'

const Qualification = styled.span`
  ${tw`underline`}

  font-weight: 600;
`

const Index = ({ location, data }) => (
  <Layout location={location}>
    <SEO title="Home" />

    <h1 className="leading-tight mb-6">
      Hi, I'm{' '}
      <span className="text-gray-600 hover:underline-gold-900">Bruno</span>.
    </h1>

    <p className="text-lg leading-loose">
      I'm a <Qualification>full-stack software developer</Qualification>.
      <br />
      <br />I help churches and non-governments organizations reach their
      success at
      {` `}
      <a
        href="https://www.atos6.com"
        rel="noopener noreferrer"
        className="underline"
        target="_blank"
      >
        atos6
      </a>
      .
    </p>

    <Writings posts={data.allMdx.edges} />
  </Layout>
)

export default Index

export const pageQuery = graphql`
  query {
    allMdx(sort: { fields: [frontmatter___date], order: DESC }, limit: 5) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`
