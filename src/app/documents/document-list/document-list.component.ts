import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents: Document[] = [
    new Document('1', 'Test 1', 'This document is awesome.', 'www.google.com', null),
    new Document('2', 'Test 2', 'This document is cool.', 'www.google.com', null),
    new Document('3', 'Test 3', 'This document is sweet.', 'www.google.com', null),
    new Document('4', 'Test 4', 'This document is brilliant.', 'www.google.com', null)
  ];

  constructor() { }

  ngOnInit() {
  }

  onSelected(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
