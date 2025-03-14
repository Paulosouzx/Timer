type StatusCycle = 'active' | 'interrupted' | 'finished'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interrupted?: Date
  status?: StatusCycle
}

export interface CyclesContextData {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
  amountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
}
