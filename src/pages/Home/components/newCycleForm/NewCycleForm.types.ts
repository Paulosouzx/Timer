import { UseFormRegister } from 'react-hook-form'
import { NewCycleFormData } from '../../Home'
import { Cycle } from '../../Home.types'

export interface PropCycleForm {
  register: UseFormRegister<NewCycleFormData>
  activeCycle: Cycle | undefined
}
