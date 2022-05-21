import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  // let currentSender:string = 'Darcee';
  @ViewChild('subject', { static: false }) subjectRef: ElementRef;
  @ViewChild('msgText', { static: false }) msgTextRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }

  onSendMessage() {
    const subject = this.subjectRef.nativeElement.value;
    const msgText = this.msgTextRef.nativeElement.value;
    const id = "123";
    const sender = "Darcee";
    const newMessage =  new Message(id, subject, msgText, sender);
    this.messageService.addMessage(newMessage);
  }

  onClear() {
    this.subjectRef.nativeElement.value = "";
    this.msgTextRef.nativeElement.value = "";
  }
}
