export interface AuditFields {
  createdAt: string; // ISO date string
  createdBy: string;
  updatedAt?: string; // ISO date string
  updatedBy?: string;
}

// GUID/UUID identifier for Consultant. Keep as string for portability.
// If we want stronger typing later, we can brand it.
export type ConsultantId = string;

export interface ConsultantBase {
  name: string;
  phone: string;
  email: string;
  active: boolean;
}

export interface Consultant extends ConsultantBase, AuditFields {
  id: ConsultantId;
}

export interface NewConsultant extends ConsultantBase {
  // Audit fields set by system on creation
}

export interface UpdateConsultant {
  id: ConsultantId;
  changes: Partial<ConsultantBase> & Partial<AuditFields>;
}
