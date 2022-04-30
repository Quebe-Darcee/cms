export class Contact {
  public id: id;
  public name: string;
  public email: string;
  public phone: string;
  public imageUrl: string;
  public group: Array<Contact>;

  constructor(id: id, name: string, email: string, phone: string, imageUrl: string, group: Array<Contact>) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.imageUrl = imageUrl;
    this.group = group;
  }
}
