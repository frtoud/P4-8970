import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../config';

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) { }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.feedbackMessage || error);
  }

  uploadMultipleFiles(formData: any): Promise<any>{
    return this.http.post(`${Config.apiUrl}/files/uploadMultiple`, formData)
    .toPromise()
    .then(files => files)
    .catch(UploadService.handleError);
  }

  getFile(filename: string): Promise<any>{
    return this.http.get(`${Config.apiUrl}/files/uploads/${filename}`,
    { responseType: 'blob' })
    .toPromise()
    .then(files => console.log(files))
    .catch(UploadService.handleError);
  }
}