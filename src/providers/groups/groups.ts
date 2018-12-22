import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Firebase from 'firebase';
import { Events } from 'ionic-angular';


/*
  Generated class for the GroupsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroupsProvider {

  firegroup = Firebase.database().ref('/groups');
  mygroups: Array<any> = [];
  currentgroup: Array<any> = [];
  currentgroupname;
  grouppic;
  groupmsgs;
  constructor(public events: Events) {

  }

  addgroup(newGroup) {
    var promise = new Promise((resolve, reject) => {
      this.firegroup.child(Firebase.auth().currentUser.uid).child(newGroup.groupName).set({
        groupimage: newGroup.groupPic,
        msgboard: '',
        owner: Firebase.auth().currentUser.uid
      }).then(() => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  getmygroups() {
    this.firegroup.child(Firebase.auth().currentUser.uid).once('value', (snapshot) => {
      this.mygroups = [];
      if (snapshot.val() != null) {
        var temp = snapshot.val();
        for (var key in temp) {
          var newgroup = {
            groupName: key,
            groupimage: temp[key].groupimage
          }
          this.mygroups.push(newgroup);
        }
      }
      this.events.publish('newgroup');
    })

  }

  getintogroup(groupname) {
    if (groupname != null) {
      this.firegroup.child(Firebase.auth().currentUser.uid).child(groupname).once('value', (snapshot) => {
        if (snapshot.val() != null) {
          var temp = snapshot.val().members;
          this.currentgroup = [];
          for (var key in temp) {
            this.currentgroup.push(temp[key]);
          }
          this.currentgroupname = groupname;
          this.events.publish('gotintogroup');
        }
      })
    }
  }

  getownership(groupname) {
    var promise = new Promise((resolve, reject) => {
      this.firegroup.child(Firebase.auth().currentUser.uid).child(groupname).once('value', (snapshot) => {
        var temp = snapshot.val().owner;
        if (temp == Firebase.auth().currentUser.uid) {
          resolve(true);
        }
        else {
          resolve(false);
        }
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  getgroupimage() {
    return new Promise((resolve, reject) => {
      this.firegroup.child(Firebase.auth().currentUser.uid).child(this.currentgroupname).once('value', (snapshot) => {
        this.grouppic = snapshot.val().groupimage;
        resolve(true);
      }).catch((err) => {
        reject(err)
      })
    })

  }

  addmember(newmember) {
    this.firegroup.child(Firebase.auth().currentUser.uid).child(this.currentgroupname).child('members').push(newmember).then(() => {
      this.getgroupimage().then(() => {
        this.firegroup.child(newmember.uid).child(this.currentgroupname).set({
          groupimage: this.grouppic,
          owner: Firebase.auth().currentUser.uid,
          msgboard: ''
        }).catch((err) => {
          console.log(err);
        })
      })
      this.getintogroup(this.currentgroupname);
    })
  }

  deletemember(member) {
    this.firegroup.child(Firebase.auth().currentUser.uid).child(this.currentgroupname)
      .child('members').orderByChild('uid').equalTo(member.uid).once('value', (snapshot) => {
        snapshot.ref.remove().then(() => {
          this.firegroup.child(member.uid).child(this.currentgroupname).remove().then(() => {
            this.getintogroup(this.currentgroupname);
          })
        })
      })
  }

  getgroupmembers() {
    this.firegroup.child(Firebase.auth().currentUser.uid).child(this.currentgroupname).once('value', (snapshot) => {
      var tempdata = snapshot.val().owner;
      this.firegroup.child(tempdata).child(this.currentgroupname).child('members').once('value', (snapshot) => {
        var tempvar = snapshot.val();
        for (var key in tempvar) {
          this.currentgroup.push(tempvar[key]);
        }
      })
    })
    this.events.publish('gotmembers');
  }

  leavegroup() {
    return new Promise((resolve, reject) => {
      this.firegroup.child(Firebase.auth().currentUser.uid).child(this.currentgroupname).once('value', (snapshot) => {
        var tempowner = snapshot.val().owner;
        this.firegroup.child(tempowner).child(this.currentgroupname).child('members').orderByChild('uid')
          .equalTo(Firebase.auth().currentUser.uid).once('value', (snapshot) => {
            snapshot.ref.remove().then(() => {
              this.firegroup.child(Firebase.auth().currentUser.uid).child(this.currentgroupname).remove().then(() => {
                resolve(true);
              }).catch((err) => {
                reject(err);
              })
            }).catch((err) => {
              reject(err);
            })
          })
      })
    })
  }

  deletegroup() {
    return new Promise((resolve, reject) => {
      this.firegroup.child(Firebase.auth().currentUser.uid).child(this.currentgroupname).child('members').once('value', (snapshot) => {
        var tempmembers = snapshot.val();

        for (var key in tempmembers) {
          this.firegroup.child(tempmembers[key].uid).child(this.currentgroupname).remove();
        }

        this.firegroup.child(Firebase.auth().currentUser.uid).child(this.currentgroupname).remove().then(() => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })

      })
    })
  }

  addgroupmsg(newmessage) {
    return new Promise((resolve) => {
      this.firegroup.child(Firebase.auth().currentUser.uid).child(this.currentgroupname).child('owner').once('value', (snapshot) => {
        var tempowner = snapshot.val();
        this.firegroup.child(Firebase.auth().currentUser.uid).child(this.currentgroupname).child('msgboard').push({
          sentby: Firebase.auth().currentUser.uid,
          displayName: Firebase.auth().currentUser.displayName,
          photoURL: Firebase.auth().currentUser.photoURL,
          message: newmessage,
          timestamp: Firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          if (tempowner != Firebase.auth().currentUser.uid) {
            this.firegroup.child(tempowner).child(this.currentgroupname).child('msgboard').push({
              sentby: Firebase.auth().currentUser.uid,
              displayName: Firebase.auth().currentUser.displayName,
              photoURL: Firebase.auth().currentUser.photoURL,
              message: newmessage,
              timestamp: Firebase.database.ServerValue.TIMESTAMP
            })
          }
          var tempmembers = [];
          this.firegroup.child(tempowner).child(this.currentgroupname).child('members').once('value', (snapshot) => {
            var tempmembersobj = snapshot.val();
            for (var key in tempmembersobj)
              tempmembers.push(tempmembersobj[key]);
          }).then(() => {
            /// not understand
            let postedmsgs = tempmembers.map((item) => {
              if (item.uid != Firebase.auth().currentUser.uid) {
                return new Promise((resolve) => {
                  this.postmsgs(item, newmessage, resolve);
                })
              }
            })
            Promise.all(postedmsgs).then(() => {
              this.getgroupmsgs(this.currentgroupname);
              resolve(true);
            })
          })
        })
      })
    })
  }

  postmsgs(member, msg, cb) {
    this.firegroup.child(member.uid).child(this.currentgroupname).child('msgboard').push({
      sentby: Firebase.auth().currentUser.uid,
      displayName: Firebase.auth().currentUser.displayName,
      photoURL: Firebase.auth().currentUser.photoURL,
      message: msg,
      timestamp: Firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
      cb();
    })
  }

  getgroupmsgs(groupname) {
    this.firegroup.child(Firebase.auth().currentUser.uid).child(groupname).child('msgboard').on('value', (snapshot) => {
      var tempmsgholder = snapshot.val();
      this.groupmsgs = [];
      for (var key in tempmsgholder)
        this.groupmsgs.push(tempmsgholder[key]);
      this.events.publish('newgroupmsg');
    })
  }

}
