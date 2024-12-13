import { Component,OnInit } from '@angular/core';
import { ref,uploadBytes,getDownloadURL  } from "firebase/storage";
import { app_firebase,storage_firebase,db_firestore } from '../firebase-connect';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc ,getDoc } from "firebase/firestore";
import { GenerateImageName } from '../name_images';

interface Images{

  profile_picture:any,
  cover_image:any

}



@Component({
  selector: 'app-user-images',
  templateUrl: './user-images.component.html',
  styleUrl: './user-images.component.css'
})



export class UserImagesComponent  implements OnInit{

  ngOnInit(): void {
    this.userAuthenticated()

 }


  imageUrlDefault : string= "https://firebasestorage.googleapis.com/v0/b/rede-social-365b6.appspot.com/o/"
  changeStatus:string = "alert alert-primary";
  changeText:string = "Use o Formulário Abaixo Para Gerenciar as Imagens de Seu Perfil";

  profilePicture: File | string = "";
  coverImage : File | string = "";

  profilePictureUrl : any = "";
  coverImageUrl : any = "";

  generateImageName : GenerateImageName = new GenerateImageName();
  
  images_profile : Images = {
    profile_picture:'',
    cover_image:''
  };

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

   //função de Teste
   async  getImage(path:string) : Promise<string> {
    try {
      const url = await getDownloadURL(ref(storage_firebase, path));
      //console.log(`url da Imagem : ${url}`);
      return url;
    } catch (error) {
      // Handle any errors
      //console.error(error);
      return "";
    }
  }


  async getData(user_id : any){
    const docRef = doc(db_firestore, "users", user_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data()
      try{
        
        this.profilePictureUrl = await this.getImage(`${this.UserId}/${data['profile_picture']}`)
        this.coverImageUrl = await this.getImage(`${this.UserId}/${data['cover_image']}`)

      }catch(e){

      }
    } else {
      // docSnap.data() will be undefined in this case
      //console.log("No such document!");
    }
  }

 


  onProfilePictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profilePicture = input.files[0];
      this.images_profile['profile_picture'] = this.generateImageName.frenameFile(this.profilePicture.name)
      //console.log(this.profilePicture.name);
    }
  }

  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.coverImage = input.files[0];
      this.images_profile['cover_image'] = this.generateImageName.frenameFile(this.coverImage.name)
      //console.log(this.coverImage.name);
    }
  }



  async setImages(){

      try{
        const images :Images = {profile_picture:this.profilePicture,cover_image:this.coverImage}

    
        //registra Imagem de Perfil
        let storageRef = ref(storage_firebase, `${this.UserId}/${this.images_profile.profile_picture}`);

        uploadBytes(storageRef, images.profile_picture).then((snapshot) => {
          //console.log('Imagem Principal')
          //console.log(snapshot)
          //console.log('Uploaded a blob or file!');
        });

        //Registra Imagem de Capa
        storageRef = ref(storage_firebase, `${this.UserId}/${this.images_profile.cover_image}`);

        uploadBytes(storageRef, images.cover_image).then((snapshot) => {
          //console.log('Imagem de Capa')
          //console.log(snapshot)
          //console.log('Uploaded a blob or file!');
        });

        await setDoc(doc(db_firestore, "users", this.UserId), this.images_profile,{ merge: true });

        this.changeText = "Suas Imagens foram Salvas com Sucesso!"
        this.changeStatus = "alert alert-success"

      }catch(e){
        this.changeText = "Aconteceu algum erro :("
        this.changeStatus = "alert alert-danger"
        //console.log(e)
        
      }


  }

}
