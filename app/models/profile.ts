export interface SocialNetwork {
  link: string; // URL
  type: string;
}

export interface Profile {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  description: string;
  profile_picture: string;
  socialNetworks: SocialNetwork[];
  department: string;
  previousDepartments: string[];
  degree_level: string; // TODO: this should probably be it's own type
  degree_name: string;
  degree_semester: string;
  currentJob: string; // TODO: why is this camel case
  university: string;
  nationality: string;
}
