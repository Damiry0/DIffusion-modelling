import { Component } from '@angular/core';
import * as d3 from 'd3';
import {ChartDataType} from "./models/ChartDataType";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  ngOnInit(): void {
    // Fetch JSON from an external endpoint
     d3.json('https://http://127.0.0.1:8000/model').then(data=> {
      const chartData = data as ChartDataType[];
      this.createGraph(chartData);
  });
}

createGraph(data: ChartDataType[])
{


}


}
