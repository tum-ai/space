export interface Profile {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;

  birthday?: Date;
  nationality?: string;
  description?: string;
  activityStatus: string;
  degreeLevel?: string;
  degreeName?: string;
  degreeSemester?: number;
  university?: string;

  currentDerpartment: string;
  currentDepartmentPosition: string;
}
