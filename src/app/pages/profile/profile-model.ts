export class ProfileModel {
  id: number = 0;
  name: string = "";
  email: string = "";
  address: string = "";
  phone: string = "";
  avatar: string = "";
  role: Role = new Role();
}

class Role {
  name: string = "";
  visible_name: string = "";
}
