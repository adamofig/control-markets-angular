export interface AuditDate {
  createdAt?: string;
  updatedAt?: string;
}

export enum VideoGeneratorype {
  Gen1 = 'gen1',
  Gen2 = 'gen2',
  Gen3 = 'gen3',
}

export interface IVideoGeneratorRelation {
  id: string;
  name: string;
  description: string;
}

export interface IVideoGenerator extends AuditDate {
  id: string;
  name?: string;
  description?: string;
  type?: string;
  relation?: IVideoGeneratorRelation;
}
