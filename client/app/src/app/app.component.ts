import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormComponent } from './form/form.component';
import { CommonModule } from '@angular/common';
import { CvService } from './cv.service';
import { CvData } from './models/cv-data.type';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  
}
