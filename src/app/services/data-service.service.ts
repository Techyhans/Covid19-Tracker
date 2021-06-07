import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalDataSummary } from '../models/global-data';
import { DateWiseData } from '../models/date-wise-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private GlobalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-12-2021.csv';
  private dateWiseDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  private lastUpdateDate = '';

  constructor(private http: HttpClient) {
    const today = new Date();
    const dd = String(today.getDate() - 1).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    const t = mm + '/' + dd + '/' + yyyy;
    this.lastUpdateDate = `${mm}-${dd}-${yyyy}`;
    console.log('LAST UPDATE', this.lastUpdateDate);
    this.GlobalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${mm}-${dd}-${yyyy}.csv`;
  }

  getDateWiseData(){
    return this.http.get(this.dateWiseDataUrl, {responseType: 'text'}).pipe(
      map(result => {
        const rows = result.split('\n');
        const header = rows[0];
        const dates = header.split(/,(?=\S)/);
        const mainData: any = {};
        dates.splice(0, 4);
        rows.splice(0, 1);

        rows.forEach(row => {
          const cols = row.split(/,(?=\S)/);

          const con: string = cols[1];
          cols.splice(0, 4);
          mainData[con] = [];
          cols.forEach((value, index) => {
            const dw: DateWiseData = {
              country: con,
              case: +value,
              date: new Date(Date.parse(dates[index]))

            };
            mainData[con].push(dw);
          });
        });

        return mainData;
      })
    );
  }

  getGlobalData(){
    return this.http.get(this.GlobalDataUrl, {responseType: 'text'}).pipe(
      map(result => {
        const data: GlobalDataSummary[] = [];
        const raw: any = {};

        const rows = result.split('\n');
        rows.splice(0, 1);
        rows.forEach(row => {
          const col = row.split(/,(?=\S)/);
          data.push({
            country: col[3],
            confirmed: parseInt(col[7]),
            deaths: parseInt(col[8]),
            recovered: parseInt(col[9]),
            active: parseInt(col[10]),
          });

          const cs  = {
            country: col[3],
            confirmed: parseInt(col[7]),
            deaths: parseInt(col[8]),
            recovered: parseInt(col[9]),
            active: parseInt(col[10]),
          };

          const temp: GlobalDataSummary = raw[cs.country];
          if (temp){
            temp.active = temp.active ?? 0 + cs.active;
            temp.confirmed = temp.confirmed ?? 0 + cs.confirmed;
            temp.recovered = temp.recovered ?? 0 + cs.recovered;
            temp.deaths = temp.deaths ?? 0 + cs.deaths;

            raw[cs.country] = temp;
          }
          else{
            raw[cs.country] = cs;
          }

        });


        return Object.values(raw) as GlobalDataSummary[];
      })
    );
  }
}
