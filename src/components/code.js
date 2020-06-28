import React from 'react'
import { render } from 'react-dom'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'

import nord from './nord'

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
      <Highlight {...defaultProps} theme={nord} code={codeString} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} mb-4 p-2 rounded-lg`} style={{ ...style }}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
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
