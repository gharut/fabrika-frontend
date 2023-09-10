export class Account {
  id: number = 0;
  name: string = "";
  email: string = "";
  address: string = "";
  phone: string = "";
  avatar: string = "";
  permissions: string[] = [];
  access_token: string  = "";
  role: {
    name: string,
    visible_name: string,
  } = {name :"", visible_name: ""};
}
