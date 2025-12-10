import type { Consultant, ConsultantId, NewConsultant, UpdateConsultant } from '../models/consultant'

export interface IConsultantRepository {
  create(data: NewConsultant, actor: string): Promise<Consultant>;
  update(update: UpdateConsultant, actor: string): Promise<Consultant>;
  getById(id: ConsultantId): Promise<Consultant | null>;
  list(params?: { active?: boolean; search?: string; limit?: number; offset?: number }): Promise<Consultant[]>;
}
