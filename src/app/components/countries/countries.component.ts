import { DataServiceService } from './../../services/data-service.service';
import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/global-data';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data?:GlobalDataSummary[]
  countries:string[] = []
  totalConfirmed:Number = 0
  totalRecovered:Number = 0
  totalDeath:Number = 0
  totalActive:Number = 0

  constructor(private service:DataServiceService) { }

  ngOnInit(): void {
    this.service.getGlobalData().subscribe(
      result => {
        this.data = result
        this.data.forEach(cs => {
          this.countries.push(cs.country ?? "")
        })
      }
    )
  }

  updateValues(country:string){
    console.log(country);
    this.data?.forEach(cs => {
      if(cs.country == country){
        this.totalActive = cs.active ?? 0
        this.totalConfirmed = cs.confirmed ?? 0
        this.totalDeath = cs.deaths ?? 0
        this.totalRecovered = cs.recovered ?? 0
      }
    })
  }

}
