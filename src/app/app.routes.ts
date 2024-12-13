import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { ProfileComponent } from './profile/profile.component';
import { UserDataComponent } from './user-data/user-data.component';
import { UserImagesComponent } from './user-images/user-images.component';
import { HomePersonalInformation,HomePersonalImages } from './profile-data/profile-data.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { NewPostComponent } from './new-post/new-post.component';
import { CardsComponent } from './card/cards.component';
import { CardComponent } from './card/card.component';
import { CardModalComponent } from './card/card-modal.component';
import { EditPostComponent } from './edit-post/edit-post.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'search/:query', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    {path:'register',component:RegisterComponent},
    { path: 'profile', component: ProfileComponent },
    { path: 'profile/user-images', component: UserImagesComponent },
    { path: 'profile/user-data', component: UserDataComponent },
    { path: 'profile/home-personal-information', component: HomePersonalInformation },
    { path: 'profile/home-personal-images', component: HomePersonalImages },
    { path: 'profile-page/:userId', component: ProfilePageComponent },
    { path: 'profile/new-post', component: NewPostComponent },
    { path: 'profile/edit-post/:postId', component: EditPostComponent },
];


@NgModule({
    declarations:[
        HomeComponent,
        HeaderComponent,
        LoginComponent,
        RegisterComponent,
        AlertComponent,
        ProfileComponent,
        UserImagesComponent,
        UserDataComponent,
        HomePersonalInformation,
        HomePersonalImages,
        ProfilePageComponent,
        NewPostComponent,
        CardsComponent,
        CardComponent,
        CardModalComponent,
        EditPostComponent
    
    ],

    imports: [RouterModule.forRoot(routes),FormsModule,CommonModule],
    exports: [RouterModule],
    providers:[]
  })
  export class AppRoutingModule { }