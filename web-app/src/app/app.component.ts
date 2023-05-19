import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  //@ViewChild('graphContainer') graphContainer!: ElementRef ;
  graphData: any;

  constructor() {
  }

  ngOnInit(): void {
    // Fetch JSON from an external endpoint
    d3.json('http://localhost:8000/graphs').then(data => {
      this.graphData = data;
      this.visualizeGraph();
    });
  }


  visualizeGraph(): void {

    const width = 600*2;
    const height = 400*2;

    const svg = d3.select('#my_dataviz')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g');

    const link = svg.selectAll('line')
      .data(this.graphData.links)
      .join("line")
      .style("stroke", "#aaa");
    // .enter()
    // .append('line')
    // .attr('stroke', '#999')
    // .attr('stroke-width', '1px');

    const node = svg.selectAll('circle')
      .data(this.graphData.nodes)
      .join("circle")
      .attr("r", 20)
      .style("fill", "#69b3a2");
    // .enter()
    // .append('circle')
    // .attr('r', 10)
    // .attr('fill', '#ff5722');

    const simulation = d3.forceSimulation(this.graphData.nodes)
      .force('link', d3.forceLink(this.graphData.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('end', ticked);

    // node.call(d3.drag()
    //   .on('start', (event: any, d: any) => {
    //     if (!event.active) simulation.alphaTarget(0.3).restart();
    //     d.fx = d.x;
    //     d.fy = d.y;
    //   })
    //   .on('drag', (event: any, d: any) => {
    //     d.fx = event.x;
    //     d.fy = event.y;
    //   })
    //   .on('end', (event: any, d: any) => {
    //     if (!event.active) simulation.alphaTarget(0);
    //     d.fx = null;
    //     d.fy = null;
    //   }));

    function ticked() {
      link.attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    }

  }

}

