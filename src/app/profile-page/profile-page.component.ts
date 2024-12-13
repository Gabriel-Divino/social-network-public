import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { app_firebase,storage_firebase,db_firestore } from '../firebase-connect';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc,getDoc } from "firebase/firestore";
import { ref,uploadBytes,getDownloadURL  } from "firebase/storage";
import { api_url } from '../endpoint';


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})




export class ProfilePageComponent implements OnInit {

  UserProfile: any = "";
  UserProfileId : any| null = "";
  UserId : string|null = "";
  coverImage : string|null = "";
  ProfilePicture : string|null = "";
  Posts : any = [];

    constructor(private route: ActivatedRoute) { 
      this.userAuthenticated()
    }

    userAuthenticated(){
      const auth = getAuth(app_firebase);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          
          //console.log(user)
          this.UserId = user.uid;
          //console.log(`Id do Usuario autenticado : ${this.UserId}`)
        } else {
         
        }
      });
    }


  async  getImage(path:string) : Promise<string> {
    try {
      const url = await getDownloadURL(ref(storage_firebase, path));
      //console.log(`url da Imagem : ${url}`);
      return url;
    } catch (error) {
      // Handle any errors
      console.error(error);
      return "";
    }
  }

  async getData(user_id : any){
    const docRef = doc(db_firestore, "users", user_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data()
      try{
        //console.log(data)
        this.UserProfile = data

        this.ProfilePicture = await this.getImage(`${user_id}/${data['profile_picture']}`)
        this.coverImage = await this.getImage(`${user_id}/${data['cover_image']}`)

      }catch(e){
        //console.log(e)
      }
    } else {
      // docSnap.data() will be undefined in this case
      //console.log("No such document!");
    }
  }

  async getPosts(user_id:string){

      fetch(`${api_url}/posts/user?userId=${user_id}`)
      .then(response=>response.json())
      .then(response=>{
          //console.log(response)
          this.Posts = response
      })

  }

  ngOnInit(): void {
    // Acessando o parâmetro da URL
    this.route.paramMap.subscribe(params => {
      const userId = params.get('userId');
      this.UserProfileId = userId
      //console.log(`Id do Perfil do Usuario : ${this.UserProfileId}`)
      if (userId) {
        this.getData(userId)
        this.getPosts(userId)
      }
    });
  }
}
