import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { graphModel } from '../models/graph-model';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  private localEnvironmentRoute = 'http://localhost:8000';
  constructor(private httpClient: HttpClient) {}

  getGraph(): Observable<graphModel> {
    return this.httpClient.get<graphModel>(
      this.localEnvironmentRoute + '/graphs'
    );
  }
}
