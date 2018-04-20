import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as tfc from '@tensorflow/tfjs-core';

import {SCAVENGER_CLASSES} from './SCAVENGER_CLASSES'
const INPUT_NODE_NAME = 'input';
const OUTPUT_NODE_NAME = 'final_result';
const VIDEO_PIXELS = 224;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  prediction_top : string
  @ViewChild('videoElement') videoElement: any;  
  video: any;
  predictions: any;
  model: tf.Model;
  is_loaded:boolean;
  is_playing:boolean;
  ngOnInit() {
    this.prediction_top = '';
    this.video = <HTMLVideoElement>document.querySelector("video");
    this.loadModel();
    this.is_loaded =false;
    this.is_playing =false;
    this.predict();
  }

  start() {
    this.initCamera({ video: true, audio: false });
  }
  pause(){
    this.video.pause();
  }


  initCamera(config:any) {
    var browser = <any>navigator;

    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

      browser.mediaDevices.getUserMedia(config).then(stream => {
      this.video.srcObject = stream;
      // this.video.src = window.URL.createObjectURL(stream);
      
      this.video.play().then(()=>{
        
        this.is_playing = true
        var videoHeight = this.video.videoHeight;
        var videoWidth = this.video.videoWidth;
        console.log(videoHeight);
        console.log(videoWidth);
        var aspectRatio = videoWidth / videoHeight;
        console.log(aspectRatio)
        if (videoWidth >= videoHeight) {
          this.video.height = VIDEO_PIXELS;
          this.video.width = aspectRatio * VIDEO_PIXELS;
        } else {
          this.video.width = VIDEO_PIXELS;
          this.video.height = VIDEO_PIXELS / aspectRatio;
        }
      });
      
    });
  } 

  async loadModel() {
    this.model = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
    alert("model loaded")
    this.is_loaded = true;
  }


  async predict() {
    if(this.is_loaded && this.is_playing){
      const pred =  await tf.tidy(() => {
        // Convert the canvas pixels to 
          const img = tfc.fromPixels(this.video).toFloat();
          // const offset = tf.scalar(127.5);
          // // Normalize the image from [0, 255] to [-1, 1].
          // const normalized = img.sub(offset).div(offset);

          // // Reshape to a single-element batch so we can pass it to predict.
          // const batched = normalized.reshape([1, 224, 224, 3]);
          const centerHeight = img.shape[0] / 2;
          const beginHeight = centerHeight - (VIDEO_PIXELS / 2);
          const centerWidth = img.shape[1] / 2;
          const beginWidth = centerWidth - (VIDEO_PIXELS / 2);
          var pixelsCropped =
          img.slice([beginHeight, beginWidth, 0],
                             [VIDEO_PIXELS, VIDEO_PIXELS, 3]);
          var predictr = pixelsCropped.reshape([1, 224, 224, 3]);
          // Make a prediction through mobilenet.
          return this.model.predict(predictr);
      });
      var top_3 = await this.getTopKClasses(pred,10);
      this.prediction_top = top_3[0].className
    }
    requestAnimationFrame(() => this.predict());
  }

  async getTopKClasses(logits, topK) {
    const values = await logits.data();
  
    const valuesAndIndices = [];
    for (let i = 0; i < values.length; i++) {
      valuesAndIndices.push({value: values[i], index: i});
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
}