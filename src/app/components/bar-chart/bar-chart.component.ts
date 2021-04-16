import { Component, Inject, Input, NgZone, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {

  private chart?:am4charts.XYChart;

  @Input() selectedData:any;

  constructor(@Inject(PLATFORM_ID) private platformId:any, private zone: NgZone) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {

    console.log("DDT", this.selectedData);


    // Chart code goes in here
    this.browserOnly(() => {
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      let chart = am4core.create("chartdiv_bar", am4charts.XYChart);
      chart.padding(40, 40, 40, 40);

      let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "Country";
      categoryAxis.renderer.minGridDistance = 1;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.disabled = true;

      let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;

      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = "Country";
      series.dataFields.valueX = "Value";
      series.tooltipText = "{valueX.value}"
      series.columns.template.strokeOpacity = 0;
      series.columns.template.column.cornerRadiusBottomRight = 5;
      series.columns.template.column.cornerRadiusTopRight = 5;

      let labelBullet = series.bullets.push(new am4charts.LabelBullet())
      labelBullet.label.horizontalCenter = "left";
      labelBullet.label.dx = 10;
      // labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
      labelBullet.label.text = "{values.valueX.workingValue}";
      labelBullet.locationX = 1;

      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      series.columns.template.adapter.add("fill", function(fill, target:any){
        return chart.colors.getIndex(target.dataItem.index);
      });

      categoryAxis.sortBySeries = series;
      chart.data = this.selectedData
      // chart.data = [
      //     {
      //       "network": "Facebook",
      //       "MAU": 2255250000
      //     },
      //     {
      //       "network": "Google+",
      //       "MAU": 430000000
      //     },
      //     {
      //       "network": "Instagram",
      //       "MAU": 1000000000
      //     },
      //     {
      //       "network": "Pinterest",
      //       "MAU": 246500000
      //     },
      //     {
      //       "network": "Reddit",
      //       "MAU": 355000000
      //     },
      //     {
      //       "network": "TikTok",
      //       "MAU": 500000000
      //     },
      //     {
      //       "network": "Tumblr",
      //       "MAU": 624000000
      //     },
      //     {
      //       "network": "Twitter",
      //       "MAU": 329500000
      //     },
      //     {
      //       "network": "WeChat",
      //       "MAU": 1000000000
      //     },
      //     {
      //       "network": "Weibo",
      //       "MAU": 431000000
      //     },
      //     {
      //       "network": "Whatsapp",
      //       "MAU": 1433333333
      //     },
      //     {
      //       "network": "YouTube",
      //       "MAU": 1900000000
      //     }
      //   ]

        this.chart = chart;
      });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if(changes.selectedData) {
      console.log('changes');
      // call the function
      this.ngAfterViewInit()
    }
  }

}
