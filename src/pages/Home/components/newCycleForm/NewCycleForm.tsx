import { useContext } from 'react'
import {
  FormContainer,
  MinutesAmountInput,
  TaskInput,
} from './NewCycleForm.styles'
import { CyclesContext } from '../../Home'
import { useFormContext } from 'react-hook-form'

export default function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        placeholder="De um nome para o seu projeto."
        {...register('task')}
        disabled={!!activeCycle}
      />

      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        {...register('minuteAmount', { valueAsNumber: true })}
        disabled={!!activeCycle}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
