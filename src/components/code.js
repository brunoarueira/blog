import React from 'react'
import { Highlight, Prism } from 'prism-react-renderer'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import styled from 'styled-components'

(typeof global !== "undefined" ? global : window).Prism = Prism

require("prismjs/components/prism-ruby");
require("prismjs/components/prism-diff");
require("prismjs/components/prism-javascript");

import nord from './nord'

const RE = /{([\d,-]+)}/

function calculateLinesToHighlight(meta) {
  if (RE.test(meta)) {
    const lineNumbers = RE.exec(meta)[1]
      .split(',')
      .map(v => v.split('-').map(y => parseInt(y, 10)))

    return index => {
      const lineNumber = index + 1
      const inRange = lineNumbers.some(([start, end]) =>
        end
          ? lineNumber >= start && lineNumber <= end
          : lineNumber === start
      )

      return inRange
    }
  } else {
    return () => false
  }
}

const Line = styled.div`
  display: table-row;
`

const LineNumber = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1em;
  user-select: none;
  opacity: 0.5;

  .highlight-line > & {
    background-color: #2E3440;
    color: #d8dee9;
    opacity: 1;
  }
`

const LineContent = styled.span`
  display: table-cell;
  width: 100%;

  .highlight-line > & {
    margin-right: 0.5rem;
  }
`

export const Code = ({ codeString, language, className, ...props }) => {
  const shouldHighlightLine = calculateLinesToHighlight(props.metastring)

  if (props['react-live']) {
    return (
      <LiveProvider theme={nord} code={codeString} noInline={true}>
        <div className="relative">
          <div className="rounded-t-lg border-t border-r border-l border-gray-400">
            <LiveEditor className="rounded-t-lg" style={{ fontFamily: 'Source Code Pro' }} />
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
      <Highlight theme={nord} code={codeString} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`prism-code ${className} mb-4 p-2 rounded-lg`} style={style}>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line })

              if (shouldHighlightLine(i)) {
                lineProps.className = `${lineProps.className} highlight-line`
              }

              return (
                <Line key={i} {...lineProps}>
                  <LineNumber>{i + 1}</LineNumber>
                  <LineContent>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </LineContent>
                </Line>
              )
            })}
          </pre>
        )}
      </Highlight>
    )
  }
}
