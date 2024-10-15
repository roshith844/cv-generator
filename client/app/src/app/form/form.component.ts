import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CvService } from '../cv.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  @Input() edit = null;
  @Input() showForm = false;
  @Output() editChange = new EventEmitter<any>();
  @Output() showFormChange = new EventEmitter<any>();

  cvForm !: FormGroup;

  constructor(private fb: FormBuilder, private cvService:  CvService) {}

  ngOnInit(): void {
    this.cvForm = this.fb.group({
      personalInfo: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        summary: ['']
      }),
      workExperience: this.fb.array([this.createWorkExperience()]),
      education: this.fb.array([this.createEducation()]),
      skills: this.fb.array([this.createSkill()])  // Updated to FormArray for skills
    });
  }

  get personalInfo(){
    return this.cvForm.get('personalInfo') as FormGroup;
  }

  // Close the form
  close(): void {
    this.cvForm.reset();
    this.showForm = false;
    this.showFormChange.emit(false);
    this.edit = null;
    this.editChange.emit(null);
  }

  // Work Experience
  get workExperience(): FormArray {
    return this.cvForm.get('workExperience') as FormArray;
  }

  createWorkExperience(): FormGroup {
    return this.fb.group({
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      years: ['', Validators.required]
    });
  }

  addWorkExperience(): void {
    this.workExperience.push(this.createWorkExperience());
  }

  removeWorkExperience(index: number): void {
    this.workExperience.removeAt(index);
  }

  // Education
  get education(): FormArray {
    return this.cvForm.get('education') as FormArray;
  }

  createEducation(): FormGroup {
    return this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      years: ['', Validators.required]
    });
  }

  addEducation(): void {
    this.education.push(this.createEducation());
  }

  removeEducation(index: number): void {
    this.education.removeAt(index);
  }

  // Skills
  get skills(): FormArray {
    return this.cvForm.get('skills') as FormArray;
  }

  createSkill(): FormGroup {
    return this.fb.group({
      skill: ['', Validators.required]
    });
  }

  addSkill(): void {
    this.skills.push(this.createSkill());
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  // Submit the form
  onSubmit(): void {
    if (this.cvForm.valid) {
      console.log(this.cvForm.value);
      this.cvService.createCv(this.cvForm.value).subscribe({
        next: (data: unknown)=>{
          console.log(data)
        },
        error: (err)=>{
          console.log(err)
        }
      })

    } else {
      this.cvForm.markAllAsTouched();  // Mark all fields as touched to trigger validation
    }
  }
}
