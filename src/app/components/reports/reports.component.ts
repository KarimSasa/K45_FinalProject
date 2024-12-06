import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  chart: Chart | undefined;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadAIAdoptionChart();
  }

  private loadAIAdoptionChart(): void {
    this.dataService.getAIAdoptionData().subscribe({
      next: (data) => {
        const ctx = document.getElementById('aiAdoptionChart') as HTMLCanvasElement;
        this.chart = new Chart(ctx, {
          type: 'line',
          data: data,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Multimodal AI Solution Adoption Trend'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Adoption Percentage (%)'
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
