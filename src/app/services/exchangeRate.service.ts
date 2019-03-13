import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ExchangeRateService {
  constructor(private http: HttpClient) { }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.feedbackMessage || error);
  }

  getRates(from: string, to: string, startDate: string, endDate: string): Promise<any> {
    const URL =`https://www.banqueducanada.ca/valet/observations/FX${from + to}/json?start_date=${startDate}&end_date=${endDate}`;
    return this.http.get(URL)
    .toPromise()
    .then(result => result)
    .catch(ExchangeRateService.handleError);
  }
}