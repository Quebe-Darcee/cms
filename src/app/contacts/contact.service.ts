import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  constructor(private http: HttpClient) {
    this.getContacts();
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

  getContacts(): Contact[] {
    this.http.get(
      'http://localhost:3000/contacts'
    ).subscribe(
      (response: any) => {
        this.contacts = response.contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort();
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.log(error)
      });
      return;
  }

  getContact(id:string): Contact {
    for (let contact of this.contacts) {
      if (contact.id == id) {
        return contact;
      }
    }
    return null;
  }

  storeContacts() {
    const contacts = JSON.stringify(this.contacts);
    this.http.put(
      'https://cms-que-default-rtdb.firebaseio.com/contacts.json',
      contacts,
      {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    )
    .subscribe(() => {
      this.contactListChangedEvent.next(this.contacts.slice())
    })
  }

  addContact(contact: Contact) {
      if (!contact) {
        return;
      }
      // make sure id of the new Contact is empty
      contact.id = '';

      const headers = new HttpHeaders({'Content-Type': 'application/json'});

      // add to database
      this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
        contact,
        { headers: headers })
        .subscribe(
          (responseData) => {
            // add new contact to contacts
            this.contacts.push(responseData.contact);
            this.contacts.sort();
            this.contactListChangedEvent.next(this.contacts.slice());
          }
        );
    }

  updateContact(originalContact: Contact, newContact: Contact) {
      if (!originalContact || !newContact) {
        return;
      }

      const pos = this.contacts.findIndex(d => d.id === originalContact.id);

      if (pos < 0) {
        return;
      }

      // set the id of the new Contact to the id of the old Contact
      newContact.id = originalContact.id;

      const headers = new HttpHeaders({'Content-Type': 'application/json'});

      // update database
      this.http.put('http://localhost:3000/contacts/' + originalContact.id,
        newContact, { headers: headers })
        .subscribe(
          (response: Response) => {
            this.contacts[pos] = newContact;
            this.contacts.sort();
            this.contactListChangedEvent.next(this.contacts.slice());
          }
        );
    }

  deleteContact(contact: Contact) {

      if (!contact) {
        return;
      }

      const pos = this.contacts.findIndex(d => d.id === contact.id);

      if (pos < 0) {
        return;
      }

      // delete from database
      this.http.delete('http://localhost:3000/contacts/' + contact.id)
        .subscribe(
          (response: Response) => {
            this.contacts.splice(pos, 1);
            this.contacts.sort();
            this.contactListChangedEvent.next(this.contacts.slice());
          }
        );
    }
}
