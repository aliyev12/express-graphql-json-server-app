export interface User {
  id?: string;
  firstName?: string;
  age?: number;
  companyId?: string;
}

export interface Company {
  id?: string;
  name?: string;
  description?: string;
  users?: User[];
}
