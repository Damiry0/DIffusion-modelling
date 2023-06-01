
export interface votersDTO{
  initial_condition: initial_condition[];
  iterations: iterations[];
}

interface initial_condition {
  key: string;
  value: string;
}

interface iterations {
  key: string;
  value: string;

}

interface Nodes {
  id: string;
  x: number;
  y: number;
  [key: string]: any;
}

interface Nodes {
  id: string;
}

interface Links {
  source: string;
  target: string;
}

export interface G6graphModel {
  nodes: Nodes[];
  edges: Links[];
}

export interface Graph {
  directed: boolean;
  graph: string;
  nodes: Nodes[];
  links: Links[];
  multigraph: boolean;
}
