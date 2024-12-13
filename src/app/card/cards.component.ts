import { Component,Input } from '@angular/core';
import { PostStruct } from '../struct';
import { doc,getDoc } from "firebase/firestore";
import { ref,uploadBytes,getDownloadURL  } from "firebase/storage";
import { app_firebase,storage_firebase,db_firestore } from '../firebase-connect';
import { getAuth, onAuthStateChanged } from "firebase/auth";


@Component({
  selector: 'app-cards',
  template:`
      <div id="cards">
          <div *ngFor="let post of Posts">
          <app-card [Title]="post.postTitle" [PostId]="post.post_id" [UserSessionId]="UserSessionId" [firstImage]="post.images[0]" [UserId]="post.user_id"  (click)="postModal(post.post_id)"></app-card>
          </div>

          <app-card-modal [Post]="Post" [User]="User"></app-card-modal>

      </div>

  `
})

export class CardsComponent {
    
  @Input() Posts : PostStruct[] =  [];

  Post : any = {}
  User :any = {}
  UserSessionId : string = ""

  constructor() {
    this.userAuthenticated()
}


  userAuthenticated(){
    const auth = getAuth(app_firebase);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        
        //console.log(user)
        this.UserSessionId = user.uid;
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

  async getUser(user_id : any){
    const docRef = doc(db_firestore, "users", user_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data()
      try{
        //console.log(data)
        const user : any = data
        user.ProfilePicture =  await this.getImage(`${user_id}/${data['profile_picture']}`)
        this.User = user

      }catch(e){
        //console.log(e)
      }
    } else {
      // docSnap.data() will be undefined in this case
      //console.log("No such document!");
    }
  }

  async postModal(postId:string){
    for(let post of this.Posts){
        if(post['post_id'] == postId){
          
          for(let image of post['images']){
              if(image.type == "file"){
                  if(image.content.startsWith('http') == false){
                    image.content = await this.getImage(`${post.user_id}/${image.content}`)
                  }
                  
              }
          }

          this.Post = post
          this.getUser(post.user_id)
          break
        }
    }
  }

}
