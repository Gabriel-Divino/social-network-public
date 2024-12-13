import { Component,OnInit } from '@angular/core';
import { api_url } from '../endpoint';
import { ActivatedRoute } from '@angular/router';
import { GenerateImageName } from '../name_images';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app_firebase,storage_firebase,db_firestore } from '../firebase-connect';
import { ref,uploadBytes,getDownloadURL  } from "firebase/storage";
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent implements OnInit {


  constructor(private route: ActivatedRoute,private router: Router) { 
    this.userAuthenticated()
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



  async ngOnInit(): Promise<void>  {
    this.route.paramMap.subscribe(params => {
      const postId = params.get('postId');
      this.PostId = postId
     
      if (postId) {
        fetch(`${api_url}/posts?userId=${this.UserId}&postId=${postId}`)
        .then(response=>response.json())
        .then(response =>{
            //console.log(response)
            this.postTitle = response['postTitle']
            this.postDescription = response['postDescription']

            //Imagem 1
              if(response['images'][0]['type'] == 'file'){

                this.getImage(`${this.UserId}/${response['images'][0]['content']}`)
                  .then(image=>{
                    this.imageContent1 = image
                  })

              }else{
                this.imageContent1 = response['images'][0]['content']
              }
              
              this.imageType1 = "link"

            //Imagem 2
            if(response['images'][1]['type'] == 'file'){

              this.getImage(`${this.UserId}/${response['images'][1]['content']}`)
                .then(image=>{
                  this.imageContent2 = image
                })

            }else{
              this.imageContent2 = response['images'][1]['content']
            }
            
            this.imageType2 = "link"

            //Imagem 3
            if(response['images'][2]['type'] == 'file'){

              this.getImage(`${this.UserId}/${response['images'][2]['content']}`)
                .then(image=>{
                  this.imageContent3 = image
                })

            }else{
              this.imageContent3 = response['images'][2]['content']
            }
            
            this.imageType3 = "link"
        })
      }
    });

    
  }

  

  changeStatus:String = "alert alert-primary";
  changeText:String = "Use o Formulário Abaixo para Gerenciar uma Nova Postagem";

  Token : any = "";
  UserId : any = "";
  PostId : string|null = "";

  postTitle : string = "";
  postDescription : string = "";

  imageType1 : string = "link";
  imageContent1 : string|File = "";

  imageType2 : string = "link";
  imageContent2 : string|File = "";

  imageType3 : string = "link";
  imageContent3 : string|File = "";

  generateImageName : GenerateImageName = new GenerateImageName();






  userAuthenticated(){
    const auth = getAuth(app_firebase);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.UserId = user.uid
        user.getIdToken().then((idToken) => {
          ////console.log("Token do usuário: ", idToken);
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
      //console.log('Imagem de Capa')
      //console.log(snapshot)
      //console.log('Uploaded a blob or file!');
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
            ////console.log(this.profilePicture.name);
            break;
          case "img2":
            file =  input.files[0];
            this.imageContent2 = this.generateImageName.frenameFile(file.name)
            this.uploadImage(this.imageContent2,file)
            ////console.log(this.profilePicture.name);
            break
          
          case "img3":
            file =  input.files[0];
            this.imageContent3 = this.generateImageName.frenameFile(file.name)
            this.uploadImage(this.imageContent3,file)
            break
        }   
    }
  }

  deletePost(){

    const x = window.confirm("Você Deseja Mesmo Remover Essa Postagem ?")
    if(x == true){
      const document = {
        post_id:this.PostId,
      }
      fetch(`${api_url}/posts`,{
        method:"DELETE",
        headers:{
          "Authorization":this.Token,
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(document)
      })
      .then(response=>response.json())
      .then(response=>{
        if(response['status'] == 'ok'){
          this.changeText = "Sua Postagem Foi Removida com Sucesso !"
          this.changeStatus = "alert alert-success"
          this.router.navigate([`/profile-page/${this.UserId}`])
          
        }else{
          this.changeText = "Aconteceu algum erro :("
          this.changeStatus = "alert alert-danger"
        }
      })
    }



  }

  makePost(){

    const document = {
      post_id:this.PostId,
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
    
    //console.log(document)
    //console.log(`${api_url}/posts`)
    fetch(`${api_url}/posts`,{
      method:"PUT",
      headers:{
        "Authorization":this.Token,
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(document)
    })
    .then(response=>response.json())
    .then(response=>{
      if(response['status'] == 'ok'){
        this.changeText = "Sua Postagem Foi Salva com Sucesso !"
        this.changeStatus = "alert alert-success"
      }else{
        this.changeText = "Aconteceu algum erro :("
        this.changeStatus = "alert alert-danger"
      }
    })

  }
}
