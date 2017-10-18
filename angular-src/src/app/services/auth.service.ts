import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
//import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from './../models/user';

@Injectable()
export class AuthService {
  authToken: any;
  user: User;

  constructor(private http: Http) { }

  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3001/users/register', user, {headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3001/users/authenticate', user, {headers: headers})
      .map(res => res.json());
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3001/users/profile', {headers: headers})
      .map(res => res.json());
  }
  
  storeUserData(token, user) {
    localStorage.setItem('token', token); //jwt looks here by default
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken(){
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired();
  }

  isAdmin() {
    return JSON.parse(localStorage.getItem('user')).isAdmin;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

}
