import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormComponent } from './form/form.component';
import { CommonModule } from '@angular/common';
import { CvService } from './cv.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  cvData: any[] = [];
  page: number = 1;
  limit: number = 10;

  title = 'app';
  edit = null;
  showForm = false;

  constructor(private cvService: CvService) { }
  ngOnInit(): void {
    this.fetchCvData();
  }
  showCreateCvForm() {
    this.showForm = true;
  }
  editCV(id: string){

  }

  generateCV(id: string){

  }

  fetchCvData() {
    this.cvService.getPaginatedCvData(this.page, this.limit).subscribe(response => {
      if (response.success) {
      
        this.cvData = this.cvData.concat(response.data); // Append new data
        console.log(this.cvData)
      }
    });
  }

  loadMore() {
    this.page += 1; // Increase page number
    this.fetchCvData(); // Fetch next page data
  }
}
