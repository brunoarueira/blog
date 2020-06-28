import React, { useState } from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'
import tw from 'tailwind.macro'
import { FiMenu, FiX } from 'react-icons/fi'

const LogoLink = styled(Link)`
  ${tw`text-xl no-underline hover:no-underline hover:text-gray-700`}

  font-weight: 600;
`

const Input = styled.input`
  ${tw`hidden`}

  &:checked ~ label {
    color: '#F00';
  }
  &:checked + #menu {
    display: block;
  }
`

const Label = styled.label`
  ${tw`cursor-pointer md:hidden lg:hidden absolute self-end`}

  margin-top: .2rem;
  display: initial;

  transition: all 2s ease;

  &:click {
    transform: rotate(-0.5turn);
  }
`

const Menu = styled.ul`
  ${tw`hidden w-full md:w-auto md:inline-flex md:items-center justify-center`}

  li:first-child {
    margin-right: 1rem;
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
    <nav className="m-auto w-11/12 md:w-2/4 py-8 flex flex-col md:flex-row justify-between">
      <LogoLink to="/">{title}</LogoLink>

      <Label htmlFor="menu-toggle">{!menuOpen ? <FiMenu /> : <FiX />}</Label>
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
