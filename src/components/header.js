import React, { useState } from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'
import tw from 'tailwind.macro'
import { FiMenu, FiX } from 'react-icons/fi'

const LogoLink = styled(Link)`
  ${tw`text-xl no-underline hover:no-underline hover:text-gray-700`}

  font-weight: 600;
  transition: all 2s linear;

  &.slide-logo {
    transform: translateX(calc(50% - 2.6em));
  }
`

const Input = styled.input`
  ${tw`hidden`}

  &:checked + #menu {
    ${tw`visible h-12`}

    opacity: 1;
  }
`

const Label = styled.label`
  ${tw`cursor-pointer md:hidden lg:hidden absolute self-end`}

  margin-top: .2rem;
  display: initial;
`

const Close = styled(FiX)`
  transition: all 2s ease;
  transform: rotate(-0.5turn);
`

const Menu = styled.ul`
  ${tw`
    invisible
    h-0
    w-full
    justify-center
    mt-2
    md:visible
    md:h-auto
    md:opacity-100
    md:w-auto
    md:inline-flex
    md:items-center
  `}

  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;

  li:first-child {
    ${tw`mr-0 md:mr-4`}
  }

  li {
    ${tw`my-2 py-2 border-b border-gold-900 text-center md:my-0 md:py-0 md:border-0`}
  }
`

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const {
    site: {
      siteMetadata: { title },
    },
  } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <nav className="md:m-auto mx-1 md:w-2/4 py-8 flex flex-col md:flex-row justify-between">
      <LogoLink className={`logo ${menuOpen ? 'slide-logo' : null}`} to="/">
        {title}
      </LogoLink>

      <Label htmlFor="menu-toggle">{!menuOpen ? <FiMenu /> : <Close />}</Label>
      <Input type="checkbox" id="menu-toggle" onChange={() => setMenuOpen(!menuOpen)} />

      <Menu id="menu">
        <li>
          <Link to="/blog" className="no-underline" activeClassName="active-link" partiallyActive>
            Blog
          </Link>
        </li>

        <li>
          <Link to="/about" className="no-underline" activeClassName="active-link">
            About
          </Link>
        </li>
      </Menu>
    </nav>
  )
}

export default Header
