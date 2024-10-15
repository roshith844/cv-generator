import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CvService } from '../cv.service';
import { CvData } from '../models/cv-data.type';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-cv-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cv-viewer.component.html',
  styleUrl: './cv-viewer.component.css'
})
export class CvViewerComponent {
  cvId: string | null = null; // To store the CV ID
  @ViewChild('content', { static: false }) content!: ElementRef;
  cvData: any = null
  constructor(private route: ActivatedRoute, private cvService: CvService) { }

  ngOnInit(): void {
    // Get the 'id' parameter from the route using paramMap
    this.cvId = this.route.snapshot.paramMap.get('id')
    if (this.cvId) {
      this.cvService.getCvData(this.cvId).subscribe({
        next: (response: unknown) => {
          const typedResponse = response as { success: boolean, message: string, data: any }
          console.log(typedResponse.data)
          this.cvData = typedResponse.data
        },
        error: (err) => {
          console.log(err)
        }
      })
    }
  }

  generatePDF() {
    const data = this.content.nativeElement;

    // Use html2canvas to capture the div
    html2canvas(data).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Create a new jsPDF instance
      const imgWidth = 190; // Image width
      const pageHeight = pdf.internal.pageSize.height; // Page height
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate image height
      let heightLeft = imgHeight;

      let position = 0;

      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if the content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the generated PDF
      pdf.save('resume.pdf');
    });
  }
}
