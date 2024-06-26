import React from 'react'
import { Link, graphql } from 'gatsby'
import tw, { styled } from 'twin.macro'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Writings from '../components/writings'

const Qualification = styled.span`
  ${tw`underline`}

  font-weight: 600;
`

const Highlight = styled.h1`
  ${tw`leading-tight m-auto mb-8 mt-6 md:w-2/4 w-full`}

  transition: all 1s ease;
`

const Index = ({ location, data }) => (
  <Layout location={location} fluid>
    <SEO title="Software Engineer" />

    <Highlight>
      Hi, I'm <span className="text-gray-600 hover:underline-gold-900">Bruno</span>.
    </Highlight>

    <p className="text-lg leading-loose m-auto md:w-2/4 w-full">
      I'm a <Qualification>software engineer</Qualification> which already worked on different markets.
    </p>

    <p className="text-lg leading-loose m-auto md:w-2/4 w-full">
      Experienced with multiple languages, technologies and like about optimize and performance things!
    </p>

    <Writings posts={data ? data.allMdx.edges : []} />
  </Layout>
)

export default Index

export const pageQuery = graphql`
  query {
    allMdx(filter: { fields: { sourceName: { eq: "blog" } } }, sort: { frontmatter: { date: DESC }}, limit: 5) {
      edges {
        node {
          excerpt
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
