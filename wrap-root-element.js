import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Code } from './src/components/code'
import { preToCodeBlock } from 'mdx-utils'
import styled from 'styled-components'
import tw from 'tailwind.macro'

const Paragraph = styled.p`
  ${tw`mb-8 text-xl`}
`

const Blockquote = styled.blockquote`
  ${tw`p-4 bg-neutral-100 text-neutral-600 border-l-4 border-neutral-500 italic relative text-lg mb-4`}
`

const ExternalLink = styled.a`
  ${tw`underline`}
`

const StyledUl = styled.ul`
  ${tw`text-xl mb-8`}

  list-style: inside;

  li {
    ${tw`mb-2`}
  }
`

const Caption = styled.figcaption`
  ${tw`flex flex-row items-center justify-center text-gray-700 text-sm`}
`

// components is its own object outside of render so that the references to
// components are stable
const components = {
  pre: preProps => {
    const props = preToCodeBlock(preProps)
    // if there's a codeString and some props, we passed the test
    if (props) {
      return <Code {...props} />
    } else {
      // it's possible to have a pre without a code in it
      return <pre {...preProps} />
    }
  },
  p: props => <Paragraph {...props} />,
  blockquote: props => <Blockquote>{props.children}</Blockquote>,
  a: props => {
    if (props.rel && props.rel.match(/noopener/)) {
      return <ExternalLink {...props} />
    }

    return <a {...props} />
  },
  figcaption: ({ children }) => (
    <Caption>
      <div dangerouslySetInnerHTML={{ __html: children }} />
    </Caption>
  ),
  ul: props => <StyledUl {...props} />,
}
export const wrapRootElement = ({ element }) => (
  <MDXProvider components={components}>{element}</MDXProvider>
)
