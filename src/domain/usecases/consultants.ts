import type { Consultant, ConsultantId, NewConsultant, UpdateConsultant } from '../models/consultant'
import type { IConsultantRepository } from '../repositories/consultant-repository'

export interface CreateConsultant {
  execute(input: { data: NewConsultant; actor: string }): Promise<Consultant>
}

export interface UpdateConsultantUseCase {
  execute(input: { update: UpdateConsultant; actor: string }): Promise<Consultant>
}

export interface GetConsultantById {
  execute(input: { id: ConsultantId }): Promise<Consultant | null>
}

export interface ListConsultants {
  execute(input?: { active?: boolean; search?: string; limit?: number; offset?: number }): Promise<Consultant[]>
}

// Example factory types binding repository to use cases (implementation will come later)
export type ConsultantUseCaseFactory = (repo: IConsultantRepository) => {
  create: CreateConsultant
  update: UpdateConsultantUseCase
  getById: GetConsultantById
  list: ListConsultants
}
