export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  cpf?: string;
  phone?: string;
  position?: string;
  sector?: Sector;
  sectorId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Sector {
  id: string;
  name: string;
  code: string;
  description?: string;
  organ?: string;
  secretariat?: string;
  isActive: boolean;
  parent?: Sector;
}

export interface Protocol {
  id: string;
  number: string;
  subject: string;
  description?: string;
  documentType?: string;
  status: string;
  priority: string;
  isExternal: boolean;
  requesterName?: string;
  requesterEmail?: string;
  requesterCpfCnpj?: string;
  requesterPhone?: string;
  dueDate?: string;
  attachments?: string[];
  createdBy?: User;
  originSector?: Sector;
  currentSector?: Sector;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Movement {
  id: string;
  protocolId: string;
  type: string;
  observations?: string;
  fromUser?: User;
  fromSector?: Sector;
  toSector?: Sector;
  toUser?: User;
  createdAt: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  documentType?: string;
  filePath: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  version: number;
  confidentiality: string;
  uploadedBy?: User;
  sector?: Sector;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface DashboardStats {
  totalProtocols: number;
  pendingProtocols: number;
  inProgressProtocols: number;
  completedProtocols: number;
  totalUsers: number;
  totalSectors: number;
}

export type Role = 
  | 'admin'
  | 'secretary_manager'
  | 'protocol'
  | 'internal_user'
  | 'controller'
  | 'legal'
  | 'hr'
  | 'citizen'
  | 'auditor';

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  waiting_signature: 'Aguardando Assinatura',
  signed: 'Assinado',
  completed: 'Concluído',
  archived: 'Arquivado',
  returned: 'Devolvido',
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Baixa',
  normal: 'Normal',
  high: 'Alta',
  urgent: 'Urgente',
};

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  secretary_manager: 'Gestor de Secretaria',
  protocol: 'Protocolo',
  internal_user: 'Servidor Interno',
  controller: 'Controladoria',
  legal: 'Jurídico',
  hr: 'RH',
  citizen: 'Cidadão',
  auditor: 'Auditor',
};

export const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  dispatch: 'Despacho',
  forward: 'Encaminhamento',
  return: 'Devolução',
  receive: 'Recebimento',
  sign: 'Assinatura',
  archive: 'Arquivamento',
  comment: 'Comentário',
};
