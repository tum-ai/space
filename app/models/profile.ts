export interface Profile {
  // User
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  image?: string;

  // Profile
  birthday?: Date;
  nationality?: string;
  description?: string;
  activity_status: string;
  degree_level?: string;
  degree_name?: string;
  degree_semester?: number;
  university?: string;

  // Department / DepartmentMembership
  current_department: string;
  current_department_position: string;
}
