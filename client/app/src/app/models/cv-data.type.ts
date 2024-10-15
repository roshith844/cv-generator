export interface CvData {
    id: string; // The unique identifier for the CV
    date_added: string;
    name: string; // The name of the person
    email: string; // The email address of the person
    phone: string; // The phone number of the person
    summary: string; // A brief summary or profile description
    work_experience: string; // A string containing concatenated work experience entries
    education: string; // A string containing concatenated education entries
    skills: string; // A string containing concatenated skills
}
