import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from './layout'
import { createContext, useState } from 'react'
import { Cycle, CyclesContextData } from './Home.types'
import { yupResolver } from '@hookform/resolvers/yup'
import CountDown from './components/CountDown/CountDown'
import * as yup from 'yup'
import NewCycleForm from './components/newCycleForm/NewCycleForm'

const newCycleFormValidationSchema = yup.object({
  task: yup.string().required('Informe a tarefa').min(1, 'Informe a tarefa'),
  minuteAmount: yup.number().required().min(5).max(60),
})

export type NewCycleFormData = yup.InferType<
  typeof newCycleFormValidationSchema
>

export const CyclesContext = createContext({} as CyclesContextData)

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: yupResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minuteAmount: 5,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function handlCreateNewCycle(date: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: date.task,
      minutesAmount: date.minuteAmount,
      startDate: new Date(),
    }
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)
    setAmountSecondsPassed(0)
    reset()
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            interrupted: new Date(),
          }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            status: 'finished',
          }
        } else {
          return cycle
        }
      }),
    )
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handlCreateNewCycle)} action="">
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <CountDown />
          {activeCycle ? (
            <StopCountDownButton onClick={handleInterruptCycle} type="button">
              <HandPalm size={24} /> Stop
            </StopCountDownButton>
          ) : (
            <StartCountDownButton disabled={!watch('task')} type="submit">
              <Play size={24} /> Start
            </StartCountDownButton>
          )}
        </CyclesContext.Provider>
      </form>
    </HomeContainer>
  )
}
