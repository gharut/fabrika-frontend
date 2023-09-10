export class Tag {
  id?: string;
  name?: string;
  type?: string
}

export class TagWithCount extends Tag {
  consumables_count?: number
  suppliers_count?: number
}
