
export enum Role {
  User = 'user',
  Model = 'model',
  Error = 'error'
}

export interface Message {
  role: Role;
  text: string;
  image?: string; // base64 encoded image
}
