import { Experimento } from './Experimento';

export interface Caminhada {
  id?: number;
  thermalCameraVideo: string | null;
  skeletonizationVideo: string | null;
  order: number;
  dateTime: string | null;
  observations: string | null;
  experimentId: number;
  experiment?: Experimento;
}