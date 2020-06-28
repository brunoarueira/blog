import React from 'react'
import styled from 'styled-components'
import tw from 'tailwind.macro'

import Header from './header'
import SEO from './seo'
import Footer from './footer'

const Main = styled.div`
  ${tw`mx-3 my-8 w-11/12 md:m-auto md:w-2/4`}
`

const Layout = ({ children, pageContext }) => {
  const rootPath = `${__PATH_PREFIX__}/`

  const isMdxPage = () => typeof pageContext !== 'undefined'

  const applySEO = () => {
    if (isMdxPage()) {
      return <SEO title={pageContext.frontmatter.title} />
    }

    return null
  }

  return (
    <>
      <div className="w-full h-1 bg-gold-900" />

      {applySEO()}

      <Header />

      <Main className={isMdxPage() ? 'custom-page' : ''}>{children}</Main>

      <Footer />
    </>
  )
}

export default Layout
