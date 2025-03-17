import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from './layout'
import { yupResolver } from '@hookform/resolvers/yup'
import CountDown from './components/CountDown/CountDown'
import * as yup from 'yup'
import NewCycleForm from './components/newCycleForm/NewCycleForm'
import { useContext } from 'react'
import { CyclesContext } from '../../context/CyclesContext'

const newCycleFormValidationSchema = yup.object({
  task: yup.string().required('Informe a tarefa').min(1, 'Informe a tarefa'),
  minutesAmount: yup.number().required().min(5).max(60),
})

export type NewCycleFormData = yup.InferType<
  typeof newCycleFormValidationSchema
>

export function Home() {
  const { createNewCycle, interruptCurrentCycle, activeCycle } =
    useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: yupResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 5,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(createNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <CountDown />
        {activeCycle ? (
          <StopCountDownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} /> Stop
          </StopCountDownButton>
        ) : (
          <StartCountDownButton disabled={!watch('task')} type="submit">
            <Play size={24} /> Start
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
