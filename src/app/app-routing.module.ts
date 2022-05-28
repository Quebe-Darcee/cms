import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents/documents.component';
import { MessagesComponent } from './messages/messages.component';
import { ContactsComponent } from './contacts/contacts.component';

const appRoutes: Routes = [
  {path: '', redirectTo: '/documents', pathMatch: 'full'},
  {path: '/documents', component: DocumentsComponent},
  {path: '/messages', component: MessagesComponent},
  {path: '/contacts', component: ContactsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
