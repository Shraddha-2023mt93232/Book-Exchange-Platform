import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  isSignDivVisiable: boolean  = true;

  signUpObj: SignUpModel  = new SignUpModel();
  loginObj: LoginModel  = new LoginModel();

  constructor(private router: Router){}


  onRegister() {
    const localUser = localStorage.getItem('angular17users');
    if(localUser != null) {
      console.log(this.isSignDivVisiable)
      const users =  JSON.parse(localUser);
      users.push(this.signUpObj);
      localStorage.setItem('angular17users', JSON.stringify(users))
    } else {
      const users = [];
      users.push(this.signUpObj);
      localStorage.setItem('angular17users', JSON.stringify(users))
    }
    alert('Registration Success')
  }

  onLogin() {
    const localUsers =  localStorage.getItem('angular17users');
    

    if(localUsers != null) {
      const users =  JSON.parse(localUsers);

      const isUserPresent =  users.find( (user:SignUpModel)=> user.email == this.loginObj.email && user.password == this.loginObj.password);
      if(isUserPresent != undefined) {
        alert("User Found...");
        localStorage.setItem('loggedUser', JSON.stringify(isUserPresent));
        this.router.navigateByUrl('/dashboard');
        this.isSignDivVisiable = false
        console.log(this.isSignDivVisiable)
      } else {
        alert("No User Found")
      }
    }
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
