import { Component,OnInit,Input } from '@angular/core';
import { ref,uploadBytes,getDownloadURL  } from "firebase/storage";
import { app_firebase,storage_firebase,db_firestore } from '../firebase-connect';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit{

  image : string = "";

  

  @Input() Title:string = ""
  @Input() firstImage : any = {}
  @Input() UserId : string = ""
  @Input() UserSessionId : string = ""
  @Input() PostId : string = ""

  async ngOnInit(): Promise<void> {
    await this.getImage()
  }

  async getImage(){
    //console.log(this.firstImage.type == "file")
    if(this.firstImage.type == "file"){
      //console.log(`${this.UserId}/${this.firstImage.content}`)
      const url = await getDownloadURL(ref(storage_firebase, `${this.UserId}/${this.firstImage.content}`))
      //console.log(`Url retornada : ${url}`)
      this.image = url
      //console.log(this.image)
    }else{
      this.image = this.firstImage.content
    }


  }






  openModal(){
    document.getElementById('modal')?.click()
  }

}
