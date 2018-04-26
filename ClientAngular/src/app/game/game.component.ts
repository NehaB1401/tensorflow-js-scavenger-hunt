import { Component, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as tfc from '@tensorflow/tfjs-core';
import { Router, ActivatedRoute } from '@angular/router';
import { SCAVENGER_CLASSES, DEMOCLASSES } from './SCAVENGER_CLASSES'
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { ArrayType } from '@angular/compiler/src/output/output_ast';
import {ScoreService} from '../services/score.service'
import {NavbarComponent} from '../navbar/navbar.component'
const OUTPUT_NODE_NAME = 'final_result';
const VIDEO_PIXELS = 224;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  title = 'app';
  user : SocialUser;
  @ViewChild('videoElement') videoElement: any;
  video: any;
  predictions: any;
  model: tf.Model;
  is_loaded: boolean;
  is_playing: boolean;
  top_10: any;
  find_this: string;
  user_type:string;
  score:number;
  navBar : NavbarComponent;
  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private scoreservice :ScoreService) {
              
    this.user_type = this.route.snapshot.params.user;       
    this.authService.authState.subscribe((user) => {
      this.user = this.user_type == 'guest' ? new SocialUser():user;;
    });
   
  
    if (this.user == null){
      this.router.navigate([''])
    }
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
    });
    this.score = 0;
    this.predictions = '';
    this.get_random_item();
    this.video = <HTMLVideoElement>document.querySelector("video");

    this.is_loaded = false;
    this.is_playing = false;
    this.top_10 = [];
    this.loadModel().then(_ => console.log("model loaded"));
    this.video.onplaying = () => { this.predict() }
  }
  get_random_item() {
    this.find_this = DEMOCLASSES[Math.floor(Math.random() * DEMOCLASSES.length)];
  }

  async start() {
    this.initCamera({ 'video': { facingMode: 'environment' }, audio: false });
    this.video.onloadeddata = () => {
      this.is_playing = true;
    }
  }
  pause() {
    this.video.pause();
    this.is_playing = false;
    
  }
  quit(){
    this.pause();
    if (this.user!=null){
      if(this.score>0){
        this.pushscore()
      }
      //this.authService.signOut();
    }

    alert('Game Over'+' Your Score is '+this.score)
    
    this.router.navigate([''])
  }

  pushscore(){
    this.scoreservice.pushscore(this.user.email,this.score);
  }

  initCamera(config: any) {
    var browser = <any>navigator;

    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    browser.mediaDevices.getUserMedia(config).then(stream => {
      this.video.srcObject = stream;
      this.video.play().then(() => {
        this.warmUpModel();
      });
    });
  }

  warmUpModel() {
    this.model.predict(tf.zeros([1, VIDEO_PIXELS, VIDEO_PIXELS, 3]));
    this.top_10.length = 0;
    this.get_random_item();
  }

  async loadModel() {
    this.model = await tf.loadModel('assets/web_model/model.json')
    // this.model = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
    this.is_loaded = true;
  }


  async predict() {
    if (this.is_loaded && this.is_playing) {
      const pred = await tf.tidy(() => {
        // Convert the canvas pixels to 
        const img = tfc.fromPixels(this.video).toFloat();
        const offset = tf.scalar(127.5);
        // Normalize the image from [0, 255] to [-1, 1].
        const normalized = img.sub(offset).div(offset);

        // Reshape to a single-element batch so we can pass it to predict.
        const batched = normalized.reshape([1, 224, 224, 3]);
        return this.model.predict(batched);
      });
      this.top_10 = await this.getTopKClasses(pred, 3);
      this.predictions = this.top_10[0];
      this.check_item_found();
    }
    requestAnimationFrame(() => this.predict());
  }

  async check_item_found() {
    await this.top_10.some(e => {
      if (e.className != undefined && (e.className).includes(this.find_this)) {
        this.pause();
        this.predictions = e;
        this.warmUpModel();
        this.showFoundPanel();

        this.score++;
        return 0;
      }
    });
  }

  async getTopKClasses(logits, topK) {
    const values = await logits.data();

    const valuesAndIndices = [];
    for (let i = 0; i < values.length; i++) {
      valuesAndIndices.push({ value: values[i], index: i });
    }
    valuesAndIndices.sort((a, b) => {
      return b.value - a.value;
    });
    const topkValues = new Float32Array(topK);
    const topkIndices = new Int32Array(topK);
    for (let i = 0; i < topK; i++) {
      topkValues[i] = valuesAndIndices[i].value;
      topkIndices[i] = valuesAndIndices[i].index;
    }

    const topClassesAndProbs = [];
    for (let i = 0; i < topkIndices.length; i++) {
      topClassesAndProbs.push({
        className: SCAVENGER_CLASSES[topkIndices[i]],
        probability: topkValues[i]
      })
    }
    return topClassesAndProbs;
  }

  getScreenshot() {
    const videoEl = document.querySelector("video")

    const canvas = document.createElement("canvas");
    canvas.width = 244
    canvas.height = 244
    canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    const image = new Image()
    image.src = canvas.toDataURL();
    return image;
  }






  showFoundPanel() {

    // Get the modal
    var modal = document.getElementById('found-modal');

    // Get the button that opens the modal
    var btn = document.getElementById("scoreboard");

    // When the user clicks on the button, open the modal

    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            
            // modal.style.display = "none";
        }
    }

}
// When the user clicks on close button of the modal, close it
closeFoundBoard() {
    // Get the modal
    var modal = document.getElementById('found-modal');
    modal.style.display = "none";
    this.start()
}
}


