import React from 'react'
import { Link } from 'gatsby'
import { FiRss, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi'
import tw, { css, styled } from 'twin.macro'

import iconProps from './icon_props'

const SocialStyle = css`
  ${tw`no-underline mr-1 sm:mr-3 hover:text-gray-600`}
`

const FeedLink = styled(Link)`
  ${SocialStyle}
`

const A = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  ${SocialStyle}
`

const Footer = () => (
  <footer className="w-full h-14 mt-8">
    <div className="m-auto w-11/12 md:w-2/4">
      <div className="flex flex-row items-center justify-between md:items-right md:float-right py-6">
        <FeedLink to="/feed.xml" title="Subscribe to the RSS feed">
          <FiRss size={24} {...iconProps} />
        </FeedLink>

        <A
          href="https://github.com/brunoarueira"
          title="See my open source contributions on GitHub"
        >
          <FiGithub size={24} {...iconProps} />
        </A>

        <A href="https://www.linkedin.com/in/brunoarueira" title="LinkedIn">
          <FiLinkedin size={24} {...iconProps} />
        </A>

        <A href="https://twitter.com/bruno_arueira" title="Follow me on Twitter">
          <FiTwitter size={24} {...iconProps} />
        </A>
      </div>
    </div>
  </footer>
)

export default Footer
