import { Component, OnChanges, OnInit } from '@angular/core';
import { CvService } from '../cv.service';
import { Router } from '@angular/router';
import { CvData } from '../models/cv-data.type';
import { FormComponent } from '../form/form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ FormComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  implements OnInit {
  cvData: CvData[] = [];
  page: number = 1;
  limit: number = 1;
  totalLoaded: number = 0;

  title = 'app';
  edit = null;
  showForm = false;

  constructor(private cvService: CvService, private router: Router) { }

  ngOnInit(): void {
    this.fetchCvData();
  }
  showCreateCvForm() {
    this.showForm = true;
  }

  replaceCvData(updatedData: CvData) {
    const id = updatedData.id;
    const index = this.cvData.findIndex(cv => cv.id === updatedData.id);
    if (index === -1) {
      console.error(`CV with ID ${updatedData.id} not found.`);
      return;
    }

    // Replace the old CV with the updated one
    this.cvData[index] = updatedData;
  }

  editCV(id: string) {
    // this.showCreateCvForm = true;
    // this.edit = this.cv 


    // Usage
    const cvIdToFind = Number(id)
    const foundCv = this.findCvById(this.cvData, cvIdToFind);

    if (foundCv) {
      this.edit = foundCv
      this.showForm = true
    } else {
      console.log('CV not found');
    }
  }
  findCvById(cvArray: any[], id: number) {
    return cvArray.find(cv => cv.id === id);
  }

  generateCV(id: string) {
    this.router.navigate([`/cv/show`, id]);
  }

  fetchCvData() {
    this.cvService.getPaginatedCvData(this.page, this.limit).subscribe(response => {
      if (response.success) {
        this.cvData = this.cvData.concat(response.data as any); // Append new data
        this.totalLoaded += response.data.length; // Update total loaded count
        console.log(this.cvData);
      }
    });
  }

  loadMore() {
    this.page += 1; // Increase page number
    this.fetchCvData(); // Fetch next page data
  }
  goBack() {
    if (this.page > 1) {
      this.page -= 1; // Decrease page number
      this.totalLoaded -= this.limit; // Decrease total loaded count
      this.cvData = this.cvData.slice(0, this.totalLoaded); // Adjust the displayed data
      this.fetchCvData(); // Fetch the previous page data
    }
  }
}
