import { Component } from '@angular/core';


@Component({
    selector: 'app-home-personal-information',
    template: `
    <style>
        #btn_prosseguir{
            display: block;
            margin: 0 auto; 
            width: fit-content;
            font-size: 150%;
            margin-top: 5%;
        }

    </style>
    <app-user-data></app-user-data>
    <a id="btn_prosseguir" class="btn btn-success" routerLink="/profile/home-personal-images">Prosseguir</a>

    `
 
  })

  export class HomePersonalInformation {
  
}




@Component({
    selector: 'app-home-personal-images',
    template: `
    <style>
        #btn_prosseguir{
            display: block;
            margin: 0 auto; 
            width: fit-content;
            font-size: 150%;
            margin-top: 5%;
        }

    </style>
    <app-user-images></app-user-images>
    <a id="btn_prosseguir" class="btn btn-success" routerLink="/">Prosseguir</a>

    `
 
  })

  export class HomePersonalImages {
  
  }