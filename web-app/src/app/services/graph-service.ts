import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  private localEnvironmentRoute = 'http://localhost:8000';
  constructor(private httpClient: HttpClient) {}

  getGraph(): Observable<any> {
    return this.httpClient.get(this.localEnvironmentRoute + '/graphs');
  }
}
