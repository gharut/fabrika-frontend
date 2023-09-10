export class User {
  id?: string;
  name?: string;
  email?: string
  address?: string
  phone?: string
  avatar?: string
  role?: UserRole
}

export class UserRole {
  id?: string;
  visible_name?: string;
}
