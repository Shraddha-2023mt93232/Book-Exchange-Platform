import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { bookExchangePlatformService } from '../../services/book-exchange-service';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // bookechangePlatformService = bookExchangePlatformService
  isSignDivVisiable: boolean  = true;

  signUpObj: SignUpModel  = new SignUpModel();
  loginObj: LoginModel  = new LoginModel();
  users: any

  constructor(private router: Router, private bookExchangePlatformService: bookExchangePlatformService){}
  ngOnInit(): void {
    this.bookExchangePlatformService.getUsers().subscribe(res =>{
      this.users = res
    }
    )
  }

  onRegister() {
    const userExists = this.users.some((user: { email: string }) => user.email === this.signUpObj.email);
    
    

      if (userExists === false)
        {
         
           console.log(this.isSignDivVisiable)
           const userData = {
            id: uuidv4(),
            email: this.signUpObj.email,
            dateOfBirth: this.signUpObj.dob,
            name: this.signUpObj.firstName,
            gender: "",
            phone: this.signUpObj.phn,
            password: this.signUpObj.password
           }
           this.bookExchangePlatformService.createUser(userData).subscribe()
           alert('Registration Success')
           
         } 
         else {
          alert('User already exists')
         
         
      
    }
    
  }

  onLogin() {
    console.log(this.loginObj)
    const userExists = this.users.some((user: { email: string }) => user.email === this.loginObj.email);
    if(userExists===true){

      const res = this.bookExchangePlatformService.login(this.loginObj).subscribe()
      alert("User Found...");
      localStorage.setItem('loggedUser', JSON.stringify(userExists));
        this.router.navigateByUrl('/dashboard');
        this.isSignDivVisiable = false
        console.log(this.isSignDivVisiable)
      
      
    }
    else {
      alert("No User Found")
    }
    

    // if(localUsers != null) {
    //   const users =  JSON.parse(localUsers);

    //   const isUserPresent =  users.find( (user:SignUpModel)=> user.email == this.loginObj.email && user.password == this.loginObj.password);
    //   if(isUserPresent != undefined) {
        
        
    //   } 
    // }
  }

}

export class SignUpModel  {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phn: string;
  gender: string;
  dob: string


  constructor() {
    this.email = "";
    this.firstName = "";
    this.password= "";
    this.lastName = "";
    this.phn = "";
    this.gender = "";
    this.dob = '0000-00-00'
  }
}

export class LoginModel  { 
  email: string;
  password: string;

  constructor() {
    this.email = ""; 
    this.password= ""
  }
}
