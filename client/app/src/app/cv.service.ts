import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {CvForm } from '../app/models/cv.type'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CvService {
baseUrl = 'http://localhost:3000/'
  constructor(private http: HttpClient) { }

  createCv(body: CvForm ){
    return this.http.post(this.baseUrl, body)
  }

  getPaginatedCvData(page: number, limit: number): Observable<{ success: boolean; message: string;
     data: CvForm[]; page: number; limit: number }> {
    return this.http.get<{ success: boolean; message: string; data: CvForm[];
       page: number; limit: number }>(`${this.baseUrl}cv?page=${page}&limit=${limit}`);
  }

  editCv(id: string, body: CvForm): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(`${this.baseUrl}cv/update/${id}`, body);
  }

  getCvData(id: string,){
    return this.http.get(`${this.baseUrl}cv/formatted/${id}`);
  }
}
