import { Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user:SocialUser;
  username: string;
  userImage:string;
  constructor(private authService: AuthService) {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.userImage = user!=null? user.photoUrl : 'assets/anom.png';
      this.username = user!=null?user.firstName : '';
      
    });
   }

  ngOnInit() {
    
  }

}
