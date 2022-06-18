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
      'https://cms-que-default-rtdb.firebaseio.com/documents.json'
    ).subscribe(
      (documents: Document[]) => {
        this.documents = documents;
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
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    var documentsListClone = this.documents.slice();

    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument){
      return
    }
    var pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return
    }
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    var documentsListClone = this.documents.slice();
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
     if (!document) {
        return;
     }
     const pos = this.documents.indexOf(document);
     if (pos < 0) {
        return;
     }
     this.documents.splice(pos, 1);
     var documentsListClone = this.documents.slice();
     this.storeDocuments();
  }
}
