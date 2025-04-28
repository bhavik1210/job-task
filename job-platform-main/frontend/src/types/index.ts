export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  category: string;
}

export interface Application {
  userId: {
    name: string;
    email: string;
  };
  job: {
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    postedDate: string;
    category: string;
  };
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  appliedDate: string;
  coverLetter: string;
  resume: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employer' | 'jobseeker';
  company?: string;
}