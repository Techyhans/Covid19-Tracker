import { DataServiceService } from './../../services/data-service.service';
import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/global-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0
  totalRecovered = 0
  totalDeath = 0
  totalActive = 0
  globalData?:GlobalDataSummary[];

  constructor(private dataService:DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      {
        next: (result) => {
          console.log(result)
          this.globalData = result
          result.forEach(cs => {
            if(!Number.isNaN(cs.confirmed)){
              this.totalConfirmed += cs.confirmed ?? 0
            }

            if(!Number.isNaN(cs.recovered)){
              this.totalRecovered += cs.recovered ?? 0
            }

            if(!Number.isNaN(cs.deaths)){
              this.totalDeath += cs.deaths ?? 0
            }

            if(!Number.isNaN(cs.active)){
              this.totalActive += cs.active ?? 0
            }

          })

          console.log(this.totalRecovered);

        }
      }
    )
  }

}
