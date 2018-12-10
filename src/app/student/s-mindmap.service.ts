import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Mindmap} from '../mindmap';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SMindmapService {

  private baseUrl = '';

  tempUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.baseUrl = environment.apiUrl;
  }

  getMindmapList(course_id: string): Observable<Mindmap[]> {
    this.tempUrl = this.baseUrl + 'mindmap_id_list/' + course_id;
    return this.http.get<any>(this.tempUrl);
  }

  getMindmap(course_id: string, mind_id: string): Observable<any> {
    this.tempUrl = this.baseUrl + 'mindmap/' + course_id + '/' + mind_id;
    return this.http.get<any>(this.tempUrl);
  }
}
