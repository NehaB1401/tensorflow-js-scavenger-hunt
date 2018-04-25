import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: SocialUser;
  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
    });
  }

  playGame() {
    this.router.navigate['/game'];
  } 

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  
  

  signOut(): void {
    this.authService.signOut()
    this.user = null;
  }
  
}
