import * as WordCloud from 'wordcloud';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { Storage } from '@ionic/Storage';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { NavController, ModalController, NavParams } from '@ionic/angular';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { ProserviceService } from '../proservice.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

const MEDIA_FILES_KEY = 'mediaFiles';
const url='http://localhost:5000/recog'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  
  showMe:boolean=true
  
  ngAfterViewInit(): void {
    let canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
    canvas.width=window.innerWidth
    canvas.height=window.innerHeight
    WordCloud(canvas, {list:this.service.getCloudList(), minRotation:0, maxRotation:0})

    setTimeout(() => {
      this.showMe=false
    }, 1200);
  }
  
  mediaFiles = [];
  faMicrophone=faMicrophone
  @ViewChild('myvideo',{static:false}) myVideo: any;
  
  constructor(public modalController: ModalController,public service:ProserviceService,public navCtrl: NavController, private mediaCapture: MediaCapture, private storage: Storage, private transfer: FileTransfer, private file: File, private media: Media) {}
  ionViewDidLoad() {
   

  }
 
  captureAudio() {
    this.mediaCapture.captureAudio().then(res => {
      console.log(res,res[0]['fullPath'])
      let fileTransfer: FileTransferObject = this.transfer.create();
      try{
        let options: FileUploadOptions = {
          fileKey: 'audio',
          fileName: res[0]['name'],
          httpMethod:'POST',
          mimeType:'audio/wav',
          chunkedMode:false,
          headers:{
            
          },
       }
       fileTransfer.upload(res[0]['fullPath'], url, options)
        .then(async (data) => {
          let da=JSON.parse(data.response)
          console.log('data',da)
          const modal = await this.modalController.create({
            component: ModalPage,
            componentProps: {
              'language': da['language_code'],
              'transcript': da['transcript'],
            }
          });
          return await modal.present();
        }, (err) => {
          console.log('error',err)
        })
      
      }catch(err){
        console.log('e',err)
      }
      this.storeMediaFiles(res);
    }, (err) => {
      console.log(err)
      
    });
  }
 
  storeMediaFiles(files) {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      if (res) {
        let arr = JSON.parse(res);
        arr = arr.concat(files);
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
      } else {
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files))
      }
      this.mediaFiles = this.mediaFiles.concat(files);
    })
  }
}



@Component({
  templateUrl: 'home.modal.html',
  selector: 'modal-page',
  styleUrls: ['home.page.scss'],
})
export class ModalPage {

  language
  transcript
  constructor(navParams: NavParams,public modal:ModalController) {
    // componentProps can also be accessed at construction time using NavParams
    this.language=navParams.get('language')
    this.transcript=navParams.get('transcript')
  }
  
  cancel(){
    this.modal.dismiss({
      'dismissed':true
    })
  }

}