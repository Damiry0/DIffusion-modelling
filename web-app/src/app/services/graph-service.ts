import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModelParams } from '../models/model-params';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  private localEnvironmentRoute = 'http://localhost:8000/';
  constructor(private httpClient: HttpClient) {}

  getGraph(): Observable<any> {
    return this.httpClient.get(this.localEnvironmentRoute + 'graphs');
  }
  getIterations(model: string, params: ModelParams): Observable<any> {
    return this.httpClient.post<any>(
      `${this.localEnvironmentRoute}${model}`,
      params,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }
}
