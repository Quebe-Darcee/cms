import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.getDocuments();
    this.maxDocumentId = this.getMaxId();
  }

  getMaxId(): number {
    var maxId = 0;

    for (let document of this.documents) {
      var currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getDocuments(): Document[] {
    this.http.get(
      'http://localhost:3000/documents'
    ).subscribe(
      (response: any) => {
        this.documents = response.documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort();
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.log(error)
      });
      return;
  }

  getDocument(id:string): Document {
    for (let document of this.documents) {
      if (document.id == id) {
        return document;
      }
    }
    return null;
  }

  storeDocuments() {
    const docs = JSON.stringify(this.documents);
    this.http.put(
      'https://cms-que-default-rtdb.firebaseio.com/documents.json',
      docs,
      {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    )
    .subscribe(() => {
      this.documentListChangedEvent.next(this.documents.slice())
    })
  }s

  addDocument(document: Document) {
      if (!document) {
        return;
      }

      // make sure id of the new Document is empty
      document.id = '';

      const headers = new HttpHeaders({'Content-Type': 'application/json'});

      // add to database
      this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
        document,
        { headers: headers })
        .subscribe(
          (responseData) => {
            // add new document to documents
            this.documents.push(responseData.document);
            this.documents.sort();
            this.documentListChangedEvent.next(this.documents.slice());
          }
        );
    }

  updateDocument(originalDocument: Document, newDocument: Document) {
      if (!originalDocument || !newDocument) {
        return;
      }

      const pos = this.documents.findIndex(d => d.id === originalDocument.id);

      if (pos < 0) {
        return;
      }

      // set the id of the new Document to the id of the old Document
      newDocument.id = originalDocument.id;

      const headers = new HttpHeaders({'Content-Type': 'application/json'});

      // update database
      this.http.put('http://localhost:3000/documents/' + originalDocument.id,
        newDocument, { headers: headers })
        .subscribe(
          (response: Response) => {
            this.documents[pos] = newDocument;
            this.documents.sort();
            this.documentListChangedEvent.next(this.documents.slice());
          }
        );
    }


  deleteDocument(document: Document) {

      if (!document) {
        return;
      }

      const pos = this.documents.findIndex(d => d.id === document.id);

      if (pos < 0) {
        return;
      }

      // delete from database
      this.http.delete('http://localhost:3000/documents/' + document.id)
        .subscribe(
          (response: Response) => {
            this.documents.splice(pos, 1);
            this.documents.sort();
            this.documentListChangedEvent.next(this.documents.slice());
          }
        );
    }
}
