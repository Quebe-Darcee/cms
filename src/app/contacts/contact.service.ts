import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getMaxId(): number {
    var maxId = 0;

    for (let contact of this.contacts) {
      var currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    var contactsListClone = this.contacts.slice();

    this.contactListChangedEvent.next(contactsListClone);
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact){
      return
    }
    var pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    var contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id:string): Contact {
    for (let contact of this.contacts) {
      if (contact.id == id) {
        return contact;
      }
    }
    return null;
  }

  deleteContact(contact: Contact) {
     if (!contact) {
        return;
     }
     const pos = this.contacts.indexOf(contact);
     if (pos < 0) {
        return;
     }
     this.contacts.splice(pos, 1);
     var contactsListClone = this.contacts.slice();
     this.contactListChangedEvent.next(contactsListClone);
  }
}
