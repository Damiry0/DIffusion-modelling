import { Component, OnInit } from '@angular/core';
import { GraphService } from './services/graph-service';
import G6 from '@antv/g6';
import { G6graphModel, graphModel } from './models/graph-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  graphData!: graphModel;
  selected: any;

  constructor(private graphService: GraphService) {}

  ngOnInit(): void {
    this.graphService.getGraph().subscribe((data) => {
      this.graphData = data;
      this.mapGraphData(data);
      console.log(this.graphData);
      this.visualizeGraph(this.graphData);
    });
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
}
