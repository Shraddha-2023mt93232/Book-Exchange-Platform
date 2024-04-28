import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  showModalPopup = false
  tableHeaders = [
    "Book Title",
    "Author Name",
    "Released On",
    "Available", 
    "Actions"
  ]
  user: any;
  data = [
    {
      bookName: "Book1",
      author: "Author1",
      releasedOn: "2023-12-04",
      available: true
    },
    {
      bookName: "Book2",
      author: "Author2",
      releasedOn: "2023-12-04",
      available: false
    },
    {
      bookName: "Book3",
      author: "Author3",
      releasedOn: "2023-12-04",
      available: true
    }
  ]
  constructor(private router: Router) {
    const localUser = localStorage.getItem('loggedUser');
    if(localUser != null) {
      this.user = JSON.parse(localUser);
    }
  }
  
  onLogoff() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login')
  }

  deleteAccount(user: string){
    this.showModalPopup=true
    console.log(user)
    // ccmd to delete user
    // this.showModalPopup=false
  }
}


