import { DateWiseData } from './../../models/date-wise-data';
import { DataServiceService } from './../../services/data-service.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/global-data';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data?: GlobalDataSummary[];
  countries: string[] = [];
  totalConfirmed = 0;
  totalRecovered = 0;
  totalDeath = 0;
  totalActive = 0;
  dateWiseData: any = [];
  selectedCountryData: DateWiseData[] = [];

  @Output() changeData: EventEmitter<any> = new EventEmitter<any>();

  constructor(private service: DataServiceService) { }

  ngOnInit(): void {

    this.service.getDateWiseData().subscribe(
      (result) => {
        this.dateWiseData = result;
      }
    );

    this.service.getGlobalData().subscribe(
      result => {
        this.data = result;
        this.countries.push("Select Country")
        this.data.forEach(cs => {
          this.countries.push(cs.country ?? '');
        });
      }
    );
  }

  updateValues(country: string){
    this.data?.forEach(cs => {
      if (cs.country === country){
        this.totalActive = cs.active ?? 0;
        this.totalConfirmed = cs.confirmed ?? 0;
        this.totalDeath = cs.deaths ?? 0;
        this.totalRecovered = cs.recovered ?? 0;
      }
    });

    this.selectedCountryData = this.dateWiseData[country];

    this.changeData.emit(this.dateWiseData[country]);
  }

}
