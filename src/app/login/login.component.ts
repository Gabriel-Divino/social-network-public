import { Component } from '@angular/core';
import { getAuth, signInWithEmailAndPassword,GoogleAuthProvider ,signInWithPopup } from "firebase/auth";
import { app_firebase } from '../firebase-connect';
import { Router } from '@angular/router';
 
interface LoginForm{
  email:any;
  password:any;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})




export class LoginComponent {

  
  constructor(private router: Router) {
    
  }


  Email : String = "";
  Password : String = "";

  changeStatus:String = "alert alert-primary";
  changeText:String = "Use o Formulário Abaixo Para Fazer Login !";
  auth : any = getAuth(app_firebase);

  getEmail(email:any):string{
    if(typeof(email) == 'string'){
      return email
    }else{
      return "user"
    }


  }

  login_with_google(){
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential : any = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    //const user = result.user;
    const email = result.user.email
    localStorage.setItem('user',this.getEmail(email))

    this.router.navigate(['/'])
    // ...
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  }


  login(){
    
    let login_form : LoginForm = {email:this.Email,password:this.Password};
    //console.log(login_form)

    try{
      
    signInWithEmailAndPassword(this.auth,login_form.email, login_form.password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        //console.log(user)
        this.changeStatus = "alert alert-success"
        this.changeText = "Login Realizado com sucesso !"

        localStorage.setItem('user',login_form.email)
        this.router.navigate(['/'])
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.changeText = errorCode
        this.changeStatus = "alert alert-danger"
      });
    }catch(e){
      //console.log(e)
    }


  }


}
