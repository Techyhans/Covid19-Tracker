import { DataServiceService } from './../../services/data-service.service';
import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  lastUpdateDate = ""
  totalConfirmed = 0
  totalRecovered = 0
  totalDeath = 0
  totalActive = 0
  mainData:any = []
  datatable:any = []
  globalData?:GlobalDataSummary[];
  pieChart:GoogleChartInterface={
    chartType: "PieChart"
  }
  columnChart:GoogleChartInterface={
    chartType: "ColumnChart"
  }

  constructor(private dataService:DataServiceService) {
    // Get Last Update Date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var t = mm + '/' + dd + '/' + yyyy;
    this.lastUpdateDate = `${mm}-${parseInt(dd) - 2}-${yyyy}`
    console.log("LAST UPDATE", this.lastUpdateDate)
   }

  initChart(caseType:string){
    this.datatable = []
    this.mainData = []
    let value:Number
    this.datatable.push(["Country", "Cases"])
    this.globalData?.forEach(cs => {
      if(caseType == "a"){
        if(cs.active ?? 0 > 0){
          value = cs.active ?? 0
        }
      }
      if(caseType == "c"){
        if(cs.confirmed ?? 0 > 0){
          value = cs.confirmed ?? 0
        }
      }
      if(caseType == "d"){
        if(cs.deaths ?? 0 > 0){
          value = cs.deaths ?? 0
        }
      }
      if(caseType == "r"){
        if(cs.recovered ?? 0 > 0){
          value = cs.recovered ?? 0
        }
      }

      this.datatable.push({"Country": cs.country, "Value": value})
      this.mainData.push({"Country": cs.country, "Value": value})
    })

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: this.datatable,
      //firstRowIsData: true,
      options: {
        height: 500
      },
    };

    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: this.datatable,
      //firstRowIsData: true,
      options: {
        height: 500
      },
    };

    this.pieChart.component?.draw()
    this.columnChart.component?.draw()
  }

  updateValue(caseType:HTMLInputElement){
    console.log(caseType.value)
    this.initChart(caseType.value)

  }

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

          this.initChart("c")

          console.log("RECOVERED", this.totalRecovered);

        }
      }
    )
  }

}
