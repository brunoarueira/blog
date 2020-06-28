import React from 'react'
import { Link } from 'gatsby'
import { FiChevronRight } from 'react-icons/fi'
import styled from 'styled-components'
import tw from 'tailwind.macro'

import tailwindConfig from '../utils/tailwindConfig'

import { MoveChevronStyle } from '../components/shared_styles'

import Icon from '../components/icon'
import iconProps from '../components/icon_props'

const { theme } = tailwindConfig

const StyledLink = styled(Link)`
  ${tw`no-underline hover:underline`}

  text-decoration-color: ${theme.colors.gold['900']} !important;

  ${MoveChevronStyle}
`

const Writings = ({ posts = [] }) => (
  <div className="w-screen -ml-3 md:-ml-89 py-6 bg-gray-100 mt-8 md:py-12">
    <div className="m-auto w-11/12 md:w-2/4">
      <h5 className="mb-0">Some random toughts</h5>

      <div className="w-2/6 border-b border-gold-900 my-3" />

      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug

        return (
          <p className="py-2" key={node.fields.slug}>
            <Link to={node.fields.slug} className="no-underline hover:underline">
              {title}
            </Link>
          </p>
        )
      })}

      <p className="pt-2">
        <StyledLink to="/blog">
          See More
          <Icon>
            <FiChevronRight size={14} {...iconProps} />
          </Icon>
        </StyledLink>
      </p>
    </div>
  </div>
)

export default Writings
