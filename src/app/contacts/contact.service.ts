import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from '/MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.ingredients.slice();
  }
  getContact(id:string): Contact {
    for (let contact of contacts) {
      if (contact.id == this.id) {
        return contact;
      }
    }
    return null;
  }
}
