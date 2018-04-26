import { Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { ScoreService } from '../services/score.service';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';

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
  constructor(private authService: AuthService, private scoreservice : ScoreService,
        private router: Router,
        private route: ActivatedRoute,) {
        this.user = null;
        this.scores=null;
   }

  ngOnInit() {
    
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.userImage = user!=null? user.photoUrl : 'assets/anom.png';
      this.username = user!=null?user.firstName : '';
      if(user!=null){
        this.getScores();
      }
    });
    // console.log(this.scoreservice.getScores('nehajj@gmail.com'));
  }

  getScores() {
    
    this.scoreservice.getScores(this.user.email).subscribe
      (response => {
        this.scores = response.score;
        this.scores = this.scores.sort(function(a, b){return b-a}).filter(score => score>0);
      });
      requestAnimationFrame(() => this.getScores());
  }

   signOut(){
    
    
    this.authService.signOut();
    this.user = null;
    this.router.navigate['/']
  }

  showMyScores() {

    // Get the modal
    var modal = document.getElementById('score-modal');

    // Get the button that opens the modal
    var btn = document.getElementById("scoreboard");

    // When the user clicks on the button, open the modal

    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}
// When the user clicks on close button of the modal, close it
closeScoreBoard() {
    // Get the modal
    var modal = document.getElementById('score-modal');
    modal.style.display = "none";
}
  
}
