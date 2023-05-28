import { Graph } from './graph-model';

export interface ModelParams {
  data: Graph;
  initial_fraction: number;
  iterations: number;
  q?: number;
  i?: number;
  b_min?: number;
  b_max?: number;
  t_min?: number;
  t_max?: number;
  r_negative?: number;
  r_neutral?: number;
  r_positive?: number;
  epsilion?: number;
  gamma?: number;
}
