export interface ProfileResponse{
  success: boolean,
  data: {
    id: number,
    name: string,
    email: string,
    address: string,
    phone: string,
    avatar: string,
    role: {
      name: string,
      visible_name: string
    }
    roles: object
  }
}
