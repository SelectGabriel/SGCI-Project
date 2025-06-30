export interface Pesquisador {
  id?: number;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  document: string;
  type: string;
  uuid?: number;
  institution: string;
  isAdmin : boolean;
}