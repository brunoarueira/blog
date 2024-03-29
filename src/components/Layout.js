import React from 'react'
import tw, { styled } from 'twin.macro'
import { useLocation } from '@reach/router'

import Header from './header'
import SEO from './seo'
import Footer from './footer'

const Main = styled.div`
  ${({ fluid }) => {
    if (fluid) {
      return tw`md:mx-3 md:my-8 w-full md:m-auto mx-1`
    } else {
      return tw`mx-3 my-8 w-11/12 md:m-auto md:w-2/4`
    }
  }}
`

const Layout = ({ children, pageContext, fluid = false }) => {
  const rootPath = `${__PATH_PREFIX__}/`

  const isMdxPage = () => typeof pageContext !== 'undefined'

  const location = useLocation()

  const applySEO = () => {
    if (isMdxPage()) {
      return (
        <SEO
          title={pageContext.frontmatter.title}
          description={pageContext.frontmatter.description}
          slug={pageContext.frontmatter.slug}
        />
      )
    }

    return null
  }

  return (
    <>
      <div className="w-full h-1 bg-gold-900" />

      {applySEO()}

      <Header />

      <Main className={isMdxPage() ? 'custom-page' : ''} fluid={fluid}>{children}</Main>

      <Footer />
    </>
  )
}

export default Layout
