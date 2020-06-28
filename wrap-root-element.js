import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Code } from './src/components/code'
import { preToCodeBlock } from 'mdx-utils'

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
  p: props => <p className="mb-8 text-xl" {...props} />,
  blockquote: props => (
    <blockquote className="p-4 bg-neutral-100 text-neutral-600 border-l-4 border-neutral-500 italic quote relative text-lg mb-4">
      {props.children}
    </blockquote>
  ),
  a: props => {
    if (props.rel.match(/noopener/)) {
      return <a className="underline" {...props} />
    }

    return <a {...props} />
  },
}
export const wrapRootElement = ({ element }) => (
  <MDXProvider components={components}>{element}</MDXProvider>
)
