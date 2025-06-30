import { Participante } from "./Participante";
import { Pesquisador } from "./Pesquisador";

export interface Experimento {
  id?: number;
  researcherId?: number;
  participantId?: number;
  researcher?: Pesquisador;
  participant?: Participante;
  experimentStartDate: string;
  observations: string;
  status?: string;
}