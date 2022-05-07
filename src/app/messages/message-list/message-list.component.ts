import { Component, OnInit } from '@angular/core';

import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message('1', 'Meeting Today', 'Please come to the meeting.', 'Darcee' ),
    new Message('2', 'How are you?', 'How are you feeling right now?', 'Adam' ),
    new Message('2', 'Doing good', 'I am doing good. How are you doing?', 'Linda' )
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
