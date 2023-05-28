import { Graph } from './graph-model';

export interface VoterParams {
  data: Graph;
  initial_fraction: number;
  iterations: number;
}
