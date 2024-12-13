import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { api_url } from '../endpoint';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

    Posts:any = "";
    Query:string|null = "";


  constructor(private router: Router,private route: ActivatedRoute) {
    
   }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const query = params.get('query');
      let url : string
      if(query == null){
        url =   `${api_url}/posts/search`
      }else{
        url = `${api_url}/posts/search?q=${query}`
      }
      this.getPosts(url)
    
    });

     
  }




  getPosts(url:string) : void{

    fetch(url,{
      headers:{
        'Content-Type': 'application/json' 
      },
    })
    .then(response=>response.json())
    .then(response=>{
        console.log(response)
        if(response.length > 0){
          this.Posts = response
        }
        
    })

  }



}
