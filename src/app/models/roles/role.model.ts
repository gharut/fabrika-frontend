export class Role {
  id?: string;
  name?: string;
  visible_name?: string
  permissions?: Permission[]
}

export class Permission {
  id?: string;
  category?: string;
  name?: string;
  visible_name?: string;
}
