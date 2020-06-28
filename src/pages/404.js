import React from 'react'

import Layout from '../components/Layout'
import SEO from '../components/seo'

const NotFoundPage = ({ location }) => (
  <Layout location={location}>
    <SEO title="404: Not Found" />

    <div className="container pt-4 pb-8 m-auto w-2/4">
      <h1>Not Found</h1>

      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </div>
  </Layout>
)

export default NotFoundPage
