export type InitiativeStatus = 'not_started' | 'in_progress' | 'complete';

export interface IInitiativePostRequest {
  reason: string;
  programId: string;
}

export interface IInitiativePutRequest {
  parentId: string;
  taskId: string;
  taskStatus: InitiativeStatus;
}

export interface IInitiativeProgramCreatePayload {
  userId: string;
  reason: string;
  programId: string;
}

export interface IInitiativeProgramUpdatePayload {
  userId: string;
  parentId: string;
  taskId: string;
  taskStatus: InitiativeStatus;
}
