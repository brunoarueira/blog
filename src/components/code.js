import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import Prism from 'prism-react-renderer/prism'
import styled from 'styled-components'

(typeof global !== "undefined" ? global : window).Prism = Prism

require("prismjs/components/prism-ruby");

import nord from './nord'

const LineNumber = styled.span`
  display: inline-block;
  width: 1.6em;
  user-select: none;
  opacity: 0.5;
  text-align: right;
  margin-right: 1em;
`

export const Code = ({ codeString, language, ...props }) => {
  if (props['react-live']) {
    return (
      <LiveProvider theme={nord} code={codeString} noInline={true}>
        <div className="relative">
          <div className="rounded-t-lg border-t border-r border-l border-gray-400">
            <LiveEditor
              className="rounded-t-lg"
              style={{
                fontFamily: 'Source Code Pro',
              }}
            />
            <LiveError />
          </div>

          <div className="bg-white rounded-b-lg h-24 min-h-full p-4 border-b border-r border-l border-gray-400">
            <LivePreview />
          </div>
        </div>
      </LiveProvider>
    )
  } else {
    return (
      <Highlight {...defaultProps} theme={nord} code={codeString.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} mb-4 p-2 rounded-lg`} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                <LineNumber>{i + 1}</LineNumber>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    )
  }
}
