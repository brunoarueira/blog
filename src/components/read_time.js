import React from 'react'

export default ({ time }) => {
  const minuteLabel = () => (time === 1 ? 'min' : 'mins')

  return (
    <>
      {time} {minuteLabel()} to read
    </>
  )
}
