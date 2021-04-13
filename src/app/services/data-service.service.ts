import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalDataSummary } from '../models/global-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private GlobalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-12-2021.csv'

  constructor(private http:HttpClient) { }

  getGlobalData(){
    return this.http.get(this.GlobalDataUrl, {responseType: "text"}).pipe(
      map(result => {
        let data:GlobalDataSummary[] = []
        let raw:any = {}

        let rows = result.split("\n")
        rows.splice(0,1)
        rows.forEach(row => {
          let col = row.split(/,(?=\S)/)
          data.push({
            country: col[3],
            confirmed: parseInt(col[7]),
            deaths: parseInt(col[8]),
            recovered: parseInt(col[9]),
            active: parseInt(col[10]),
          })

          let cs  ={
            country: col[3],
            confirmed: parseInt(col[7]),
            deaths: parseInt(col[8]),
            recovered: parseInt(col[9]),
            active: parseInt(col[10]),
          }

          let temp:GlobalDataSummary = raw[cs.country]
          if(temp){
            temp.active = temp.active ?? 0 + cs.active
            temp.confirmed = temp.confirmed ?? 0 + cs.confirmed
            temp.recovered = temp.recovered ?? 0 + cs.recovered
            temp.deaths = temp.deaths ?? 0 + cs.deaths

            raw[cs.country] = temp
          }
          else{
            raw[cs.country] = cs
          }

        })


        return <GlobalDataSummary[]>Object.values(raw)
      })
    )
  }
}
