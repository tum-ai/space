interface Department {
  name: string;
}

interface DepartmentMembership {
  department: Department;
  department_position: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  department_memberships: DepartmentMembership[];
}