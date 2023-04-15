import React from 'react'
import { Link } from 'gatsby'
import tw, { styled } from 'twin.macro'

import { MoveChevronStyle } from './shared_styles'

import tailwindConfig from '../utils/tailwindConfig'

const { theme } = tailwindConfig

export default styled(Link)`
  ${tw`uppercase no-underline hover:underline`}

  text-decoration-color: ${theme.colors.gold['900']} !important;
  font-weight: 400;

  ${MoveChevronStyle}
`
