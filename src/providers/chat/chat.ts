import Firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {
  firebuddychats = Firebase.database().ref('/buddychats');
  buddy: any;
  buddymessages = [];
  constructor(public events: Events) {
  }
  initializebuddy(buddy) {
    this.buddy = buddy;
  }
  addnewmessage(msg) {
    if (this.buddy) {
      var promise = new Promise((resolve, reject) => {
        this.firebuddychats.child(Firebase.auth().currentUser.uid).child(this.buddy.uid).push({
          sentby: Firebase.auth().currentUser.uid,
          message: msg,
          timestamp: Firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          this.firebuddychats.child(this.buddy.uid).child(Firebase.auth().currentUser.uid).push({
            sentby: Firebase.auth().currentUser.uid,
            message: msg,
            timestamp: Firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            resolve(true);
          })
        })
      })
      return promise;
    }
  }
  getbuddymessages() {
    let temp;
    this.firebuddychats.child(Firebase.auth().currentUser.uid).child(this.buddy.uid).on('value', (snapshot) => {
      this.buddymessages = [];
      temp = snapshot.val();
      for (var tempkey in temp) {
        this.buddymessages.push(temp[tempkey]);
      }
      this.events.publish('newmessage');
    })
  }

}
