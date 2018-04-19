import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {SCAVENGER_CLASSES} from './SCAVENGER_CLASSES'
const MODEL_FILE_URL = 'assets/ts-model/web_model.pb';
const WEIGHT_MANIFEST_FILE_URL = 'assests/ts-model/weights_manifest.json';
const INPUT_NODE_NAME = 'input';
const OUTPUT_NODE_NAME = 'final_result';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  @ViewChild('videoElement') videoElement: any;  
  video: any;
  predictions: any;
  model: tf.Model;
  is_loaded:boolean;
  ngOnInit() {
    this.video = this.videoElement.nativeElement;
    this.loadModel();
    this.is_loaded =false;
    this.predict(document.querySelector("img"))
  }

  start() {
    this.initCamera({ video: true, audio: false });
  }
  pause() {
    //this.video.pause();
    
    this.predict(document.querySelector("img"))
  }
  initCamera(config:any) {
    var browser = <any>navigator;

    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    browser.mediaDevices.getUserMedia(config).then(stream => {
      this.video.src = window.URL.createObjectURL(stream);
      this.video.play();
    });
  } 

  async loadModel() {
    this.model = await tf.loadModel('/assets/web_model/model.json');
    console.log("model loaded")
    this.is_loaded = true;
  }


  async predict(imageData: any) {
    if(this.is_loaded){
      const pred = await tf.tidy(() => {
        // Convert the canvas pixels to 
        let pixels = tf.fromPixels(imageData);
        const centerHeight = pixels.shape[0] / 2;
        const beginHeight = centerHeight - (224 / 2);
        const centerWidth = pixels.shape[1] / 2;
        const beginWidth = centerWidth - (224 / 2);
        const pixelsCropped =
        pixels.slice([beginHeight, beginWidth, 0],
                             [224, 224, 3]);
        var img = pixelsCropped.reshape([1, 224, 224, 3]);
        img = tf.cast(img, 'float32');
        // Make and format the predications
        return this.model.predict(img) as any;
        // Save predictions on the component
        //this.predictions = Array.from(output.dataSync()); 
      });
      var top_3 = await this.getTopKClasses(pred,3);
      console.log(top_3);
    }
    
    //requestAnimationFrame(() => this.predict(document.querySelector("img")));
  }

  getTopKClasses(predictions: any, topK: number) {
  
    const values = predictions.dataSync();

    let predictionList = [];
    for (let i = 0; i < values.length; i++) {
      predictionList.push({value: values[i], index: i});
    }
    predictionList = predictionList.sort((a, b) => {
      return b.value - a.value;
    }).slice(0, topK);

    return predictionList.map(x => {
      return {label: SCAVENGER_CLASSES[x.index], value: x.value};
    });
  }
}
