import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app_firebase } from '../firebase-connect';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent  implements OnInit{

  User : string = "";
  UserId : string = "";
  Query:string = "";

  constructor(private router: Router) {
      this.userAuthenticated()
  }



  userAuthenticated(){
    const auth = getAuth(app_firebase);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        
        //console.log(user)
        this.UserId = user.uid;
      } else {
       
      }
    });
  }

  click(){
    this.router.navigate([`/profile-page/${this.UserId}`])

  }

  search(event:any){
    //console.log(this.Query)
    this.router.navigate([`/search/${this.Query}`])
  }


  ngOnInit(): void {
    const user : any = localStorage.getItem('user')
    //console.log(user)
     if(user != null){
       this.User = user
     }
   }

}
