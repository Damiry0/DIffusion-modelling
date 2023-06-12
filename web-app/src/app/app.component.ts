import { Component, OnInit } from '@angular/core';
import { GraphService } from './services/graph-service';
import G6 from '@antv/g6';
import { Graph, Model, votersDTO } from './models/graph-model';
import { FormControl, FormGroup } from '@angular/forms';
import { ModelParams } from './models/model-params';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  selected: any;
  response: any;
  graph: Graph | any;
  selectedModel: number | any = 1;
  graph_temp: Graph | any;

  graph_canvas: any = null;

  models: Model[] = [
    { id: 1, name: 'Voter', path: 'voter' },
    { id: 2, name: 'Q-Voter', path: 'qvoter' },
    { id: 3, name: 'Majority Rule', path: 'majority-rule' },
    { id: 4, name: 'Sznajd Model', path: 'sznajd' },
    { id: 5, name: 'Cognitive Opinion Dynamics', path: 'cod' },
    { id: 6, name: 'Algorithmic Bias Media Model', path: 'bias' },
    { id: 7, name: 'Hegselmann-Krause', path: 'hegselmann' },
    { id: 8, name: 'Weighted Hegselmann-Krause', path: 'weighted_voter' },
  ];

  ModelParams = new FormGroup({
    data: new FormControl<Graph | any>(null),
    initial_fraction: new FormControl<number | null>(null),
    iterations: new FormControl<number | null>(null),
    q: new FormControl<number | null>(null),
    i: new FormControl<number | null>(null),
    b_min: new FormControl<number | null>(null),
    b_max: new FormControl<number | null>(null),
    t_min: new FormControl<number | null>(null),
    t_max: new FormControl<number | null>(null),
    r_negative: new FormControl<number | null>(null),
    r_neutral: new FormControl<number | null>(null),
    r_positive: new FormControl<number | null>(null),
    epsilon: new FormControl<number | null>(null),
    gamma: new FormControl<number | null>(null),
  });

  callingFunction() {
    this.ModelParams.value.data = this.graph;
    this.graphService
      .getIterations(
        this.models[this.selectedModel - 1].path,
        this.ModelParams.value as ModelParams
      )
      .subscribe((voters) => {
        this.response = voters;
        this.graph_temp = this.mapGraphData(this.graph);
        this.graph_temp = this.getInitialPosition(
          this.graph_temp,
          this.response
        );
        this.renderGraph(this.graph_temp);
      });
  }

  constructor(private graphService: GraphService, private titleService: Title) {
    this.titleService.setTitle('Diffusion modelling');
  }

  ngOnInit(): void {
    this.graphService.getGraph().subscribe((graph) => {
      this.graph = graph;
    });
  }

  createGraphCanvas(): void {
    this.graph_canvas = new G6.Graph({
      container: 'mountNode',
      width: 800,
      height: 500,
      animate: true,
      animateCfg: {
        duration: 1000, // Number, the duration of one animation
      },
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'drag-node'], // Allow users to drag canvas, zoom canvas, and drag nodes
      },
    });
  }

  renderGraph(data: Graph): void {
    if (!this.graph_canvas) {
      this.createGraphCanvas();
      this.graph_canvas.data(data);
      this.graph_canvas.render();
    } else {
      this.graph_canvas.changeData(data);
    }
  }

  getInitialPosition(graphData: Graph, iterData: votersDTO): Graph {
    iterData = this.response;
    iterData.initial_condition = iterData.initial_condition.map(
      (conditions) => {
        conditions.key = conditions.key.toString();
        conditions.value = conditions.value.toString();
        return conditions;
      }
    );
    iterData.iterations = iterData.iterations.map((iteration) => {
      iteration.key = iteration.key.toString();
      iteration.value = iteration.value.toString();
      return iteration;
    });
    for (let i = 0; i < iterData.initial_condition.length; i++) {
      let node_id: number = +iterData.initial_condition[i].key;
      graphData.nodes[node_id]['style'].fill = '#FF3333';
    }

    return graphData;
  }

  getIterationChange(graphData: Graph, id: number): Graph {
    let node_id: number = +this.response.iterations[id].key;
    let node_value: number = +this.response.iterations[id].value;
    if (node_value == 1) {
      graphData.nodes[node_id]['style'].fill = '#FF3333';
    } else if (node_value == 0) {
      graphData.nodes[node_id]['style'].fill = '#3A33FF';
    }
    return graphData;
  }

  mapGraphData(graphData: Graph): Graph {
    function getRandomArbitrary(min: number, max: number) {
      return Math.random() * (max - min) + min;
    } // Simple random number generator
    graphData.nodes = graphData.nodes.map((node) => {
      node.id = node.id.toString();
      node.x = getRandomArbitrary(10, 790);
      node.y = getRandomArbitrary(10, 490);
      node['style'] = {
        ['fill']: '#3A33FF',
      };
      return node;
    });
    graphData.links = graphData.links.map((edge) => {
      edge.source = edge.source.toString();
      edge.target = edge.target.toString();
      return edge;
    });

    let arr = graphData;
    arr = JSON.parse(JSON.stringify(arr).split('"links":').join('"edges":'));
    return arr;
  }

  async animateGraph(): Promise<void> {
    let i = 0;
    const loop = setInterval(async () => {
      this.graph_temp = this.getIterationChange(this.graph_temp, i);
      console.log(i);
      i++;
      await this.renderGraph(this.graph_temp);
      if (i === this.response.iterations.length) {
        clearInterval(loop);
      }
    }, 100);
  }
}
