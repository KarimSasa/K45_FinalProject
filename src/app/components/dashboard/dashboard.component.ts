import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  content = {
    summary: '',
    sourceUrl: '',
    techStack: ''
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadDashboardContent();
  }

  private loadDashboardContent(): void {
    this.dataService.getDashboardContent().subscribe({
      next: (data) => {
        this.content = data;
      },
      error: (error) => {
        console.error('Error loading dashboard content:', error);
      }
    });
  }
}
