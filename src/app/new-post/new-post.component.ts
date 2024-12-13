import { Component } from '@angular/core';
import { GenerateImageName } from '../name_images';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app_firebase,storage_firebase,db_firestore } from '../firebase-connect';
import { api_url } from '../endpoint';
import { ref,uploadBytes,getDownloadURL  } from "firebase/storage";

interface FileName{
    img1:string,
    img2:string,
    img3:string
}


@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})



export class NewPostComponent {

  changeStatus:String = "alert alert-primary";
  changeText:String = "Use o Formulário Abaixo Criar uma Nova Postagem";

  Token : any = ""
  UserId : any = ""

  postTitle : string = "";
  postDescription : string = "";

  imageType1 : string = "link";
  imageContent1 : string|File = "";

  imageType2 : string = "link";
  imageContent2 : string|File = "";

  imageType3 : string = "link";
  imageContent3 : string|File = "";

  generateImageName : GenerateImageName = new GenerateImageName();

  imageFileName : FileName = {
    "img1":"",
    "img2":"",
    "img3":""
  }

  constructor(){
    this.userAuthenticated()
  }



  userAuthenticated(){
    const auth = getAuth(app_firebase);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.UserId = user.uid
        user.getIdToken().then((idToken) => {
          //console.log("Token do usuário: ", idToken);
          this.Token = idToken
        }).catch((error) => {
          console.error("Erro ao obter o token do usuário: ", error);
        });
       
      } else {
        
      }
    });
  }


  uploadImage(imageName:string,file:any){
    let storageRef = ref(storage_firebase, `${this.UserId}/${imageName}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Imagem de Capa')
      console.log(snapshot)
      console.log('Uploaded a blob or file!');
    });
  }


  selectImage(event: Event,img:string): void {
    const input = event.target as HTMLInputElement;
    let file : any = ""
    if (input.files && input.files.length > 0) {
        switch(img){
          case "img1":
            file =  input.files[0];
            this.imageContent1 =   this.generateImageName.frenameFile(file.name)
            this.uploadImage(this.imageContent1,file)
            //console.log(this.profilePicture.name);
            break;
          case "img2":
            file =  input.files[0];
            this.imageContent2 = this.generateImageName.frenameFile(file.name)
            this.uploadImage(this.imageContent2,file)
            //console.log(this.profilePicture.name);
            break
          
          case "img3":
            file =  input.files[0];
            this.imageContent3 = this.generateImageName.frenameFile(file.name)
            this.uploadImage(this.imageContent3,file)
            break
        }   
    }
  }

  makePost(){

    const document = {

      postTitle:this.postTitle,
      postDescription:this.postDescription,
      images:[
        {
          type:this.imageType1,
          content:this.imageContent1
        },

        {
          type:this.imageType2,
          content:this.imageContent2
        },
        
        {
          type:this.imageType3,
          content:this.imageContent3
        },
      ]   
    }
    console.log(document)
    console.log(`${api_url}/posts`)
    fetch(`${api_url}/posts`,{
      method:"POST",
      headers:{
        "Authorization":this.Token,
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(document)
    })
    .then(response=>response.json())
    .then(response=>{
      if(response['status'] == 'ok'){
        this.changeText = "Sua Postagem Foi Realizada com Sucesso !"
        this.changeStatus = "alert alert-success"
      }else{
        this.changeText = "Aconteceu algum erro :("
        this.changeStatus = "alert alert-danger"
      }
    })

  }



}
