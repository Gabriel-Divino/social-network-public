import { Component } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app_firebase } from '../firebase-connect';
import { Router } from '@angular/router';

interface RegisterForm{
    email:any;
    password:any;
    confirm_password:any;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private router: Router) {
    
  }

  Email : String = "";
  Password : String  = "";
  Confirm_Password : String = "" ;

  changeText : String = "Use o Formulário Abaixo Para se Registrar !";
  changeStatus : String = "alert alert-primary";





  register(){

    const register_form : RegisterForm = {email:this.Email,password:this.Password,confirm_password:this.Confirm_Password}
    
    if(register_form.password != register_form.confirm_password){
        this.changeText = "Senhas Não Coincidem :(";
        this.changeStatus = "alert alert-danger";
    }

    try{
      const auth = getAuth(app_firebase);
      createUserWithEmailAndPassword(auth, register_form.email, register_form.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          this.changeText = `${register_form.email}, você foi registrado(a) com sucesso !`;
          this.changeStatus = "alert alert-success";
          localStorage.setItem('user',register_form.email)
          this.router.navigate(['/profile/home-personal-information'])
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this.changeText =  errorCode;
          this.changeStatus = "alert alert-danger";
          // ..
        });

    }catch(e){


    }


  }

}
