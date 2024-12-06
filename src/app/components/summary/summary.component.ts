import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  chart: Chart | undefined;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadAIInnovationsChart();
  }

  private loadAIInnovationsChart(): void {
    this.dataService.getAIInnovationsData().subscribe({
      next: (data) => {
        const ctx = document.getElementById('aiInnovationsChart') as HTMLCanvasElement;
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'AI Market Growth Projections'
              },
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Market Value (Billion USD)'
                }
              }
            }
          }
        });
      },
      error: (error) => console.error('Error loading chart data:', error)
    });
  }
}
