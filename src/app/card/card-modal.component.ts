import { Component, Input,OnInit} from '@angular/core';
import { PostStruct ,ImagesStruc} from '../struct';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-modal',
  templateUrl:'./card-modal.component.html',
  styleUrl: './card.component.css'
})

export class CardModalComponent{
  
  constructor(private router: Router) {
    
  }



    @Input() User : any = {}

    @Input() Post : PostStruct = {
        user_id:"",
        post_id:"",
        postTitle:"",
        postDescription:"",
        postDay:"",
        postTime:"",
        images:[]
    }

    Images : any =  []


    go(){
      document.getElementById('close_modal')?.click()
      this.router.navigate([`/profile-page/${this.Post.user_id}`])
    }



    
}


