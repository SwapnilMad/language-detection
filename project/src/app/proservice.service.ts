import { Injectable } from '@angular/core';
import { SpeechClient } from '@google-cloud/speech'

@Injectable({
  providedIn: 'root'
})
export class ProserviceService {

  client
  constructor() { 
    /*this.client=new SpeechClient({
      projectId:data.project_id,
      keyFilename:'./MyFirstProject-e9cf1da3ae6b.json'
    })*/
  }


  getCloudList(){
    let list=[]
    let max=65
    let min=20
    let hello=['Hello','你好','Zdravo','Kamusta','Bonjour','Hallo','aloha','Ciao','こんにちは','Salve','Witaj','Olá','buna','Здравствуйте','Mholo']
    hello.forEach(e=>{
      list.push([e, Math.floor(Math.random() * (+max - +min)) + +min])
    })
    return list
  }
}
