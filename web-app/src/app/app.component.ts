import { Component, OnInit } from '@angular/core';
import { GraphService } from './services/graph-service';
import G6 from '@antv/g6';
import { Graph, votersDTO } from './models/graph-model';
import {
  Kinds
} from "../../../../../../AppData/Local/Programs/Python/Python310/Lib/site-packages/bokeh/server/static/js/lib/core/kinds";
import Null = Kinds.Null;
import {
  button
} from "../../../../../../AppData/Local/Programs/Python/Python310/Lib/site-packages/bokeh/server/static/js/lib/core/dom";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  selected: any;
  response: any;
  graph: Graph | any;

  graph_temp: Graph | any;

  graph_canvas: any = null;

  num: number | undefined;

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
     // console.log(graph);
      this.graphService
        .getIterations('voter', {
          data: graph,
          initial_fraction: 0.1,
          iterations: 10,
        })
        .subscribe((voters) => {
          this.response = voters;
          this.graph_temp = this.mapGraphData(graph)
          this.graph = graph
          this.graph_temp = this.getInitialPosition(this.graph_temp, this.response)
          this.renderGraph(this.graph_temp)
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

  createGraphCanvas(data: Graph): void{

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
  async renderGraph(data: Graph): Promise<void>{
    if (!this.graph_canvas){
      this.createGraphCanvas(data)
      this.graph_canvas.data(data)
      await this.graph_canvas.render()
    }
    else {
     await this.graph_canvas.changeData(data)
    }
  }

  getInitialPosition(graphData: Graph, iterData: votersDTO): Graph{

    iterData = this.response
    iterData.initial_condition = iterData.initial_condition.map((conditions) =>{
      conditions.key = conditions.key.toString();
      conditions.value = conditions.value.toString()
      return conditions;
    });
    iterData.iterations = iterData.iterations.map((iteration) =>{
      iteration.key = iteration.key.toString();
      iteration.value = iteration.value.toString()
      return iteration;
    });
    for (let i = 0;i<iterData.initial_condition.length;i++){
        let node_id: number = +iterData.initial_condition[i].key;
        graphData.nodes[node_id]['style'].fill = '#FF3333'
    }

    return graphData
  }

  getIterationChange(graphData: Graph, id: number): Graph {

    let node_id: number = +this.response.iterations[id].key;
    let node_value: number = +this.response.iterations[id].value;
    if (node_value == 1){
      graphData.nodes[node_id]['style'].fill = '#FF3333'
    }
    else if (node_value == 0){
      graphData.nodes[node_id]['style'].fill = '#3A33FF'
    }
    return graphData
  }


  mapGraphData(graphData: Graph): Graph {

    function getRandomArbitrary(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }   // Simple random number generator
    graphData.nodes = graphData.nodes.map((node) => {
      node.id = node.id.toString();
      node.x = getRandomArbitrary(10, 790);
      node.y = getRandomArbitrary(10, 490);
      node["style"] = {
        ["fill"] : '#3A33FF'}
      return node;
    });
    graphData.links = graphData.links.map((edge) => {
      edge.source = edge.source.toString();
      edge.target = edge.target.toString();
      return edge;
    });

    let arr = graphData
    arr = JSON.parse(JSON.stringify(arr).split('"links":').join('"edges":'));
    return arr;
  }

   animateGraph(): void {
    function sleep(milliseconds: number) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }

    for (let i = 0; i < this.response.iterations.length; i++) {
        console.log(this.response.iterations[i])
        this.graph_temp = this.getIterationChange(this.graph_temp, i)
        sleep(1000)
        this.renderGraph(this.graph_temp).then((value) => console.log(value));
    }
  }

  animate_test(): void{
    let graph = this.mapGraphData(this.graph)
    console.log(graph)
    this.renderGraph(graph)

  }

  buildForm() {}


}
