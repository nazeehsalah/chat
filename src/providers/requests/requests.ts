import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Connreq } from '../../models/conRequest';
import { UserProvider } from '../user/user';
import Firebase from 'firebase';
import { Events } from 'ionic-angular';
/*
  Generated class for the RequestsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RequestsProvider {
  requestsList = Firebase.database().ref('/requestsList');
  friendsList = Firebase.database().ref('/friendsList');
  userdetails;
  myfriends;
  constructor(
    public userservice: UserProvider,
    public events: Events
  ) {
  }
  sendrequest(req: Connreq) {
    var promise = new Promise((resolve, reject) => {
      this.requestsList.child(req.recipient).push({
        sender: req.sender
      }).then(() => {
        resolve({ success: true });
      })
    })
    return promise;
  }
  getmyrequestsList() {
    let allmyrequestsList;
    var myrequestsList = [];
    this.requestsList.child(Firebase.auth().currentUser.uid).on('value', (snapshot) => {
      allmyrequestsList = snapshot.val();
      myrequestsList = [];
      for (var i in allmyrequestsList) {
        myrequestsList.push(allmyrequestsList[i].sender);
      }
      this.userservice.getallusers().then((res) => {
        var allusers = res;
        this.userdetails = [];
        for (var j in myrequestsList)
          for (var key in allusers) {
            if (myrequestsList[j] === allusers[key].uid) {
              this.userdetails.push(allusers[key]);
            }
          }
        this.events.publish('gotrequests');
      })

    })
  }
  acceptrequest(buddy) {
    var promise = new Promise((resolve, reject) => {
      /* this.myfriends = []; */
      this.friendsList.child(Firebase.auth().currentUser.uid).push({
        uid: buddy.uid
      }).then(() => {
        this.friendsList.child(buddy.uid).push({
          uid: Firebase.auth().currentUser.uid
        }).then(() => {
          this.deleterequest(buddy).then(() => {
            resolve(true);
          })

        })
      })
    })
    return promise;
  }

  deleterequest(buddy) {
    console.log(buddy)
    var promise = new Promise((resolve, reject) => {
      this.requestsList.child(Firebase.auth().currentUser.uid).orderByChild('sender').equalTo(buddy.uid).once('value', (snapshot) => {
        let somekey;
        for (var key in snapshot.val())
          somekey = key;
        this.requestsList.child(Firebase.auth().currentUser.uid).child(somekey).remove().then(() => {
          resolve(true);
        })
      })
        .then(() => {

        }).catch((err) => {
          reject(err);
        })
    })
    return promise;
  }

  getmyfriends() {
    let friendsuid = [];
    this.friendsList.child(Firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let allfriends = snapshot.val();
      this.myfriends = [];
      for (var i in allfriends)
        friendsuid.push(allfriends[i].uid);

      this.userservice.getallusers().then((users) => {
        this.myfriends = [];
        for (var j in friendsuid)
          for (var key in users) {
            if (friendsuid[j] === users[key].uid) {
              this.myfriends.push(users[key]);
            }
          }
        this.events.publish('friends');
      }).catch((err) => {
        alert(err);
      })

    })
  }

}
