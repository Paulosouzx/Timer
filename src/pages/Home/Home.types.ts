type StatusCycle = 'active' | 'interrupted' | 'finished'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interrupted?: Date
  status?: StatusCycle
}
