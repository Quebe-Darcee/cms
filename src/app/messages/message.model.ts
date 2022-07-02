export class Message {
  public id: string;
  public subject: string;
  public msgText: string;
  public sender: any;

  constructor(id: string, subject: string, msgText: string, sender: any) {
    this.id = id;
    this.subject = subject;
    this.msgText = msgText;
    this.sender = sender;
  }
}
