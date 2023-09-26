export interface SocialNetwork {
  link: string;
  type: string;
}

export interface JobHistory {
  employer: string;
  position: string;
  start_date: string;
  end_date: string;
}

export interface Profile {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  description: string;
  profile_picture: string;
  socialNetworks: SocialNetwork[];
  job_history: JobHistory[];
  department: string;
  previousDepartments: string[];
  degree_level: string; // TODO: this should probably be it's own type
  degree_name: string;
  degree_semester: string;
  currentJob: string; // TODO: why is this camel case
  university: string;
  nationality: string;
}
