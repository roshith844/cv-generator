export interface CvForm {
    personalInfo: PersonalInfo;
    workExperience: WorkExperience[];
    education: Education[];
    skills: Skill[];
  }
  
  interface PersonalInfo {
    name: string;
    email: string;
    phone: string;
    summary: string;
  }
  
  interface WorkExperience {
    jobTitle: string;
    company: string;
    years: string;
  }
  
  interface Education {
    degree: string;
    institution: string;
    years: string;
  }
  
  interface Skill {
    skill: string;
  }
  