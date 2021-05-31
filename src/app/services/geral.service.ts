import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { entradaEmail} from '../models/entradaEmail.model'



@Injectable({
  providedIn: 'root'
})


export class GeralService {
  url: string = `${environment.emailPost}`;
  showMenu = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {

  }

  sendEmailConfirmation(entradaEmail : any){
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(this.url,entradaEmail,{headers:headers});
  }

  
}
