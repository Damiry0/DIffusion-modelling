import { Component, OnInit } from '@angular/core';
import { GraphService } from './services/graph-service';
import G6 from '@antv/g6';
import { G6graphModel, Graph, graphModel } from './models/graph-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  selected: any;
  response: any;
  graph: Graph | undefined;

  models = [
    { id: 1, name: 'Voter' },
    { id: 2, name: 'Q-Voter' },
    { id: 3, name: 'Majority Rule' },
    { id: 4, name: 'Sznajd Model' },
    { id: 5, name: 'Cognitive Opinion Dynamics' },
    { id: 6, name: 'Algorithmic Bias Media Model' },
    { id: 7, name: 'Hegselmann-Krause' },
    { id: 8, name: 'Weighted Hegselmann-Krause' },
  ];

  constructor(private graphService: GraphService) {}

  ngOnInit(): void {
    this.buildForm();

    this.graphService.getGraph().subscribe((graph) => {
      console.log(graph);
      this.graphService
        .getIterations('voter', {
          data: graph,
          initial_fraction: 0.1,
          iterations: 200,
        })
        .subscribe((voters) => {
          this.response = voters;
        });
    });

    /*this.graphService.getGraph().pipe(subscribe((data) => {
      this.graphData = data;
      this.mapGraphData(data);
      console.log(this.graphData);
      this.visualizeGraph(this.graphData);
    }));*/
  }

  visualizeGraph(data: any): void {
    const graph = new G6.Graph({
      container: 'mountNode',
      width: 800,
      height: 500,
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'drag-node'], // Allow users to drag canvas, zoom canvas, and drag nodes
      },
    });
    graph.data(data);
    graph.render();
  }

  mapGraphData(graphData: graphModel): G6graphModel {
    graphData.nodes = graphData.nodes.map((node) => {
      node.id = node.id.toString();
      return node;
    });
    graphData.links = graphData.links.map((edge) => {
      edge.source = edge.source.toString();
      edge.target = edge.target.toString();
      return edge;
    });
    const toG6graphModel = (input: graphModel): G6graphModel => {
      return {
        nodes: input.nodes,
        edges: input.links,
      };
    };
    return toG6graphModel(graphData);
  }

  buildForm() {}
}
