import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../config';
import { Attachments } from './instance.service';

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

  getFile(filename: Attachments): Promise<any> {
    return this.http.get(`${Config.apiUrl}/files/uploads/${filename.nomReel}`,
     {responseType: 'blob' })
    .toPromise()
    .then(files => {
      console.log(files);
      const blob = new Blob([files], {type: files.type });

      // Angular pls
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename.nomOriginal;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    })
    .catch(UploadService.handleError);
  }
}