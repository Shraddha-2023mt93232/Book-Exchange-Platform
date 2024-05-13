import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class bookExchangePlatformService{
    constructor(private http: HttpClient) {
    }
    private editDataSubject = new BehaviorSubject<any>(null);
  editData$ = this.editDataSubject.asObservable();
  options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  urlGetUser = 'http://localhost:8080/getUser'
  urlValidateUser = 'http://localhost:8080/validateUser'
  urlDeleteAccount = 'http://localhost:8080/deleteAccount'
  urlAssignBook = 'http://localhost:8080/getAssignedBook'
  urlGetAllBooks = 'http://localhost:8080/list/'
  urlCreateUser = 'http://localhost:8080/add/user'
  getAllEntity = 'http://localhost:8080/list/'

  login(body: any){
    let params = new HttpParams();
    return this.http.post(this.urlValidateUser, body)
    
  }
  assignBookToUser(body: any){
    return this.http.post(this.urlAssignBook, body)
  }

  deleteAccount(userId: any){
    return this.http.delete(this.urlDeleteAccount + "/users/" + userId)
  }

  getMyBooks(userId: any) {
    let params = new HttpParams();
    return this.http.get(this.urlAssignBook + "/users/" + userId )
  }

  createUser(body: any){
    return this.http.post(this.urlCreateUser , body)
  }

  getUsers(){
    return this.http.get(this.getAllEntity + "user")
  }

  getAllBooks(){
    return this.http.get(this.getAllEntity + "book")
  }
  



}

