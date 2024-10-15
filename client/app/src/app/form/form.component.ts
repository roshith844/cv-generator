import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CvService } from '../cv.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit, OnChanges {
  @Input() edit: any = null;
  @Input() showForm = false;
  @Output() editChange = new EventEmitter<any>();
  @Output() showFormChange = new EventEmitter<any>();
  @Output() replaceCvData = new EventEmitter<any>();

  cvForm !: FormGroup;

  constructor(private fb: FormBuilder, private cvService: CvService) { }
  ngOnInit(): void {
    if (this.edit) {
      this.cvForm = this.fb.group({
        personalInfo: this.fb.group({
          name: [this.edit.name, Validators.required],
          email: [this.edit.email, [Validators.required, Validators.email]],
          phone: [this.edit.phone, Validators.required],
          summary: [this.edit.summary]
        }),
        workExperience: this.fb.array([this.createWorkExperience()]),
        education: this.fb.array([this.createEducation()]),
        skills: this.fb.array([this.createSkill()])  // Updated to FormArray for skills
      });

      // Fill work experience
      this.edit.work_experience.forEach((work: any) => {
        const workExperienceArray = this.cvForm.get('workExperience') as FormArray;
        workExperienceArray.push(this.createWorkExperience().patchValue({
          jobTitle: work.job_title,
          company: work.company,
          years: work.years
        }));
      });

      // Fill education
      this.edit.education.forEach((edu: any) => {
        const educationArray = this.cvForm.get('education') as FormArray;
        educationArray.push(this.createEducation().patchValue({
          degree: edu.degree,
          institution: edu.institution,
          years: edu.years
        }));
      });

      // Fill skills
      this.edit.skills.forEach((skill: any) => {
        const skillsArray = this.cvForm.get('skills') as FormArray;
        skillsArray.push(this.createSkill().patchValue({
          skill: skill
        }));
      });

    } else {
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

  }

  ngOnChanges() {

    if (this.edit) {

      const workExperienceArray: FormGroup[] = []
      // Fill work experience
      this.edit.work_experience.forEach((work: any) => {
        // const workExperienceArray = this.cvForm.get('workExperience') as FormArray;
        workExperienceArray.push(
          this.fb.group({
            jobTitle: [work.job_title, Validators.required],
            company: [work.company, Validators.required],
            years: [work.years, Validators.required]
          })
        );
      });

      // // Fill education
      const educationArray: FormGroup[] = []
      this.edit.education.forEach((edu: any) => {
        const educationArray = this.cvForm.get('education') as FormArray;
        educationArray.push(
          this.fb.group({
            degree: [edu.degree, Validators.required],
            institution: [edu.institution, Validators.required],
            years: [edu.years, Validators.required]
          })
        );
      });

      // // Fill skills
      const skillsArray: FormGroup[] = []
      this.edit.skills.forEach((skill: any) => {

        skillsArray.push(

          this.fb.group({
            skill: [skill, Validators.required]
          })


        );
      });

      this.cvForm = this.fb.group({
        personalInfo: this.fb.group({
          name: [this.edit.name, Validators.required],
          email: [this.edit.email, [Validators.required, Validators.email]],
          phone: [this.edit.phone, Validators.required],
          summary: [this.edit.summary]
        }),
        workExperience: this.fb.array(workExperienceArray),
        education: this.fb.array(educationArray),
        skills: this.fb.array(skillsArray)  // Updated to FormArray for skills
      });
    }



  }

  get personalInfo() {
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
      if (this.edit) this.editCv()
      else this.createCv()
    } else {
      this.cvForm.markAllAsTouched();  // Mark all fields as touched to trigger validation
    }
  }

  createCv() {
    this.cvService.createCv(this.cvForm.value).subscribe({
      error: (err) => {
        console.log(err)
      }
    })
  }

  editCv() {
    this.cvService.editCv(this.edit.id, this.cvForm.value).subscribe({
      next: (data: unknown) => {
        const typedResponse: {
          success: boolean,
          message: string,
          data: any
        } = data as {
          success: boolean,
          message: string,
          data: any
        }

        const updatedData = typedResponse.data
        this.replaceCvData.emit(updatedData)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
