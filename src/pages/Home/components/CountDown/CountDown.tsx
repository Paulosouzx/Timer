import { CountDownContainer, Separator } from './CountDown.styles'
import { PropTypes } from './CountDown.types'

export default function CountDown({ minutes, seconds }: PropTypes) {
  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  )
}
