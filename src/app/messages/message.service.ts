import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
  }

  getMaxId() {
    var maxId = 0;

    for (let message of this.messages) {
      var currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getMessages(): Message[] {
    this.http.get(
      'https://cms-que-default-rtdb.firebaseio.com/messages.json'
    ).subscribe(
      (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messages.sort();
        this.messageChangedEvent.next(this.messages.slice());
      },
      (error: any) => {
        console.log(error)
      });
      return;
  }

  getMessage(id:string): Message {
    for (let message of this.messages) {
      if (message.id == id) {
        return message;
      }
    }
    return null;
  }

  storeMessages() {
    const messages = JSON.stringify(this.messages);
    this.http.put(
      'https://cms-que-default-rtdb.firebaseio.com/messages.json',
      messages,
      {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    )
    .subscribe(() => {
      this.messageChangedEvent.next(this.messages.slice())
    })
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
  }
}
