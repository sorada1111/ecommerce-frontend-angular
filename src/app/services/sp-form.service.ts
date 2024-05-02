import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { map } from 'rxjs/operators';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root',
})
export class SpFormService {
  private countriesUrl =
    'https://ecommerce-spring-angular-production.up.railway.app/api/countries';
  private stateUrl =
    'https://ecommerce-spring-angular-production.up.railway.app/api/states';
  constructor(private httpClient: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.httpClient
      .get<GetResponseCountries>(this.countriesUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  getStates(theCountryCode: string): Observable<State[]> {
    //search url
    const searchStatesUrl = `${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient
      .get<GetResponseState>(searchStatesUrl)
      .pipe(map((response) => response._embedded.states));
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    // build an array for "Month" dropdown list
    // -start at current startMonth and loop until 12
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYear(): Observable<number[]> {
    let data: number[] = [];
    // build an array for "Year" dropdown list
    // -start at current year and loop for the next 10 years
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseState {
  _embedded: {
    states: State[];
  };
}
