import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { ChatProvider } from '../../providers/chat/chat';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  myrequests;
  myfriends;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public requestProv: RequestsProvider,
    public events: Events,
    public alertCtrl: AlertController,
    public chatProv: ChatProvider) {
  }


  ionViewWillEnter() {
    this.requestProv.getmyrequestsList();
    console.log(this.requestProv.getmyrequestsList())
    this.requestProv.getmyfriends();
    this.myfriends = [];
    this.events.subscribe('gotrequests', () => {
      this.myrequests = [];
      this.myrequests = this.requestProv.userdetails;
    })
    this.events.subscribe('friends', () => {
      this.myfriends = [];
      this.myfriends = this.requestProv.myfriends;
    })
  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotrequests');
    this.events.unsubscribe('friends');
  }


  addbuddy() {
    this.navCtrl.push('BuddiesPage');
  }

  accept(item) {
    this.requestProv.acceptrequest(item).then(() => {

      let newalert = this.alertCtrl.create({
        title: 'Friend added',
        subTitle: 'Tap on the friend to chat with him',
        buttons: ['Okay']
      });
      newalert.present();
    })
  }

  ignore(item) {
    this.requestProv.deleterequest(item).then(() => {

    }).catch((err) => {
      alert(err);
    })
  }

  buddychat(buddy) {
    this.chatProv.initializebuddy(buddy);
    this.navCtrl.push('BuddychatPage');
  }



}
