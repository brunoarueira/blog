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

const Highlight = styled.h1`
  ${tw`leading-tight m-auto mb-8 mt-6 md:w-2/4 w-full`}

  transition: all 1s ease;
`

const Index = ({ location, data }) => (
  <Layout location={location} fluid>
    <SEO title="Tech Lead" />

    <Highlight>
      Hi, I'm <span className="text-gray-600 hover:underline-gold-900">Bruno</span>.
    </Highlight>

    <p className="text-lg leading-loose m-auto md:w-2/4 w-full">
      I'm a <Qualification>Tech Lead</Qualification> moving the Brazilian credit market forward at <a href="https://www.grafeno.digital" target="_blank" rel="noopener noreferrer">Grafeno Digital</a>.
    </p>

    <p className="text-lg leading-loose m-auto md:w-2/4 w-full">
      Experienced with multiple languages and like about optimize and performance things!
    </p>

    <Writings posts={data ? data.allMdx.edges : []} />
  </Layout>
)

export default Index

export const pageQuery = graphql`
  query {
    allMdx(sort: { fields: [frontmatter___date], order: DESC }, limit: 5) {
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
