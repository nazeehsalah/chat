import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, LoadingController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import firebase from 'firebase';
import { ImagesProvider } from '../../providers/images/images';
/**
 * Generated class for the BuddychatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-buddychat',
  templateUrl: 'buddychat.html',
})
export class BuddychatPage {
  @ViewChild('content') content: Content;
  buddy: any;
  newmessage;
  allmessages = [];
  photoURL;
  imgornot;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public chatProv: ChatProvider,
    public events: Events, 
    public zone: NgZone, 
    public loadingCtrl: LoadingController,
    public imgprov: ImagesProvider) {
    this.buddy = this.chatProv.buddy;
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.scrollto();
    this.events.subscribe('newmessage', () => {
      this.allmessages = [];
      this.imgornot = [];
      this.zone.run(() => {
        this.allmessages = this.chatProv.buddymessages;
        for (var key in this.allmessages) {
          if (this.allmessages[key].message.substring(0, 4) == 'http')
            this.imgornot.push(true);
          else
            this.imgornot.push(false);
        }
      })


    })
  }

  addmessage() {
    this.chatProv.addnewmessage(this.newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
    })
  }

  ionViewDidEnter() {
    this.chatProv.getbuddymessages();
  }

  scrollto() {
    /* setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000); */
  }

  sendPicMsg() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    this.imgprov.picmsgstore().then((imgurl) => {
      loader.dismiss();
      this.chatProv.addnewmessage(imgurl).then(() => {
        this.scrollto();
        this.newmessage = '';
      })
    }).catch((err) => {
      alert(err);
      loader.dismiss();
    })
  }





}
