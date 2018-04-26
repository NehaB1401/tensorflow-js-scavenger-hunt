import { Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { ScoreService } from '../services/score.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user:SocialUser;
  username: string;
  scores: Int32Array;
  userImage:string;
  constructor(private authService: AuthService, private scoreservice : ScoreService) {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.userImage = user!=null? user.photoUrl : 'assets/anom.png';
      this.username = user!=null?user.firstName : '';
      if(user!=null){
        this.getScores();
        console.log(this.scores.sort())
      }
    });
   }

  ngOnInit() {
    
    // console.log(this.scoreservice.getScores('nehajj@gmail.com'));
  }

  getScores() {

    this.scoreservice.getScores(this.user.email).subscribe
      (response => {
        this.scores = response.score.sort().filter(score => score>0)  ;
      });
  }
  async signOut(){
    await this.authService.signOut();
  }

}
