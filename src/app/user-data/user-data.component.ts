import { Component,OnInit } from '@angular/core';
import { db_firestore } from '../firebase-connect';
import { doc, setDoc ,getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app_firebase } from '../firebase-connect';

interface UserData{
  //userId:any,
  name:any,
  last_name : any,
  date_of_birth:any,
  gender:any,
  full_name:any,


}

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css'
})



export class UserDataComponent implements OnInit{



   ngOnInit(): void {
      this.userAuthenticated()

   }
  

  changeStatus:String = "alert alert-primary";
  changeText:String = "Use o Formulário Abaixo Gerenciar os Dados de sua Conta";

  Name : String = "";
  LastName : String = "";
  Gender:String = "";
  DateOfBirth : String = "";

  UserId:any;

  userAuthenticated(){
    const auth = getAuth(app_firebase);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        
        //console.log(user)
        this.UserId = user.uid;
        this.getData(user.uid)
      } else {
       
      }
    });
  }

  async getData(user_id : any){
    const docRef = doc(db_firestore, "users", user_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data()
      try{

        this.Name = data['name']
        this.LastName = data['last_name']
        this.DateOfBirth = data['date_of_birth']
        this.Gender = data['gender']

      }catch(e){

      }
    } else {
      // docSnap.data() will be undefined in this case
      //console.log("No such document!");
    }
  }

  async setData(){

      
      try{

        const user_data : UserData = {
          //userId : this.UserId,
          name:this.Name,
          last_name:this.LastName,
          gender:this.Gender,
          date_of_birth:this.DateOfBirth,
          full_name:`${this.Name.toLocaleLowerCase()} ${this.LastName.toLocaleLowerCase()}`
          
        }

        //console.log(user_data)
        await setDoc(doc(db_firestore, "users", this.UserId), user_data,{ merge: true });
        this.changeText = "Seus dados foram Salvos com Sucesso !"
        this.changeStatus = "alert alert-success"
      }catch(e){
        this.changeText = "Aconteceu algum erro :("
        this.changeStatus = "alert alert-danger"
        //console.log(e)
        
      }
      



  }




}
