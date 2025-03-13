import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from './style'
import { useEffect, useState } from 'react'
import { Cycle } from './Home.types'
import { differenceInSeconds } from 'date-fns'
import { yupResolver } from '@hookform/resolvers/yup'
import CountDown from './components/CountDown/CountDown'
import NewCycleForm from './components/newCycleForm/newCycleForm'

const newCycleFormValidationSchema = yup.object({
  task: yup.string().required('Informe a tarefa').min(1, 'Informe a tarefa'),
  minuteAmount: yup.number().required().min(5).max(60),
})

export type NewCycleFormData = yup.InferType<
  typeof newCycleFormValidationSchema
>

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: yupResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minuteAmount: 5,
    },
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDiference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )
        if (secondsDiference >= totalSeconds) {
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
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        }
        setAmountSecondsPassed(secondsDiference)
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

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
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [activeCycle, minutes, seconds])

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handlCreateNewCycle)} action="">
        <NewCycleForm activeCycle={activeCycle} register={register} />
        <CountDown minutes={minutes} seconds={seconds} />
        {activeCycle ? (
          <StopCountDownButton onClick={handleInterruptCycle} type="button">
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
