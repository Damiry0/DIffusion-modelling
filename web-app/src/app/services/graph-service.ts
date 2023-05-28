import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VoterParams } from '../models/VoterModel';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  private localEnvironmentRoute = 'http://localhost:8000';
  constructor(private httpClient: HttpClient) {}

  getGraph(): Observable<any> {
    return this.httpClient.get(this.localEnvironmentRoute + '/graphs');
  }
  getVoters(params: VoterParams): Observable<any> {
    return this.httpClient.post<any>(
      this.localEnvironmentRoute + `/voter`,
      params,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
}
