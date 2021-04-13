import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css']
})
export class DashboardCardComponent implements OnInit {

  @Input() totalConfirmed?:Number
  @Input() totalRecovered?:Number
  @Input() totalDeath?:Number
  @Input() totalActive?:Number


  constructor() { }

  ngOnInit(): void {
  }

}
