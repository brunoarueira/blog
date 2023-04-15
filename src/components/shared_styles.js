import { css } from 'twin.macro'

export const MoveChevronStyle = css`
  & > div {
    transition: all 1s linear;
  }

  &:hover > div {
    transform: translateX(
      ${(props) => (props.direction && props.direction === 'left' ? '-' : '')}5px
    );
  }
`
