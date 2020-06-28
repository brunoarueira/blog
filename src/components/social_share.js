import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import styled from 'styled-components'
import tw from 'tailwind.macro'
import { FiTwitter, FiLinkedin } from 'react-icons/fi'

import iconProps from '../components/icon_props'

const Section = styled.section`
  ${tw`mt-8`}

  align-items: center;
  display: flex;
  justify-content: flex-end;
`

const List = styled.ul`
  align-items: center;
  display: flex;
  flex-direction: flex-end;
  list-style: none;
  margin: 0;
  padding: 0;
  line-height: 1;
`

const ListItem = styled.li`
  margin: 0 10px;

  a svg {
    transition: all 0.8s linear;
  }

  a:hover {
    ${tw`hover:text-gray-600`}
  }

  a:hover svg {
    transform: scale(1.3, 1.3);
  }
`

export default ({ title, path }) => {
  const {
    site: {
      siteMetadata: { siteUrl },
    },
  } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `)

  return (
    <Section>
      Share this post
      <List>
        <ListItem>
          <a
            href={`https://twitter.com/intent/tweet/?text=${title}&url=${siteUrl}${path}%2F&via=bruno_arueira`}
            target="_blank"
            title="Twitter"
          >
            <FiTwitter size={22} {...iconProps} />
          </a>
        </ListItem>
        <ListItem>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${siteUrl}${path}&title=${title}&source=${title}`}
            target="_blank"
            title="LinkedIn"
          >
            <FiLinkedin size={22} {...iconProps} />
          </a>
        </ListItem>
      </List>
    </Section>
  )
}
