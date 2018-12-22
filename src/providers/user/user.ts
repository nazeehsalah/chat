import Firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  fireDB = Firebase.database().ref("usersBD")
  constructor(public afAuth: AngularFireAuth) {

  }
  addNewuser(user) {
    var promise = new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
        .then(() => {
          this.afAuth.auth.currentUser.updateProfile({
            displayName: user.name,
            photoURL: "https://www.freelogodesign.org/Content/img/logo-ex-7.png"
          }).then(() => {
            this.fireDB.child(this.afAuth.auth.currentUser.uid).set({
              uid: this.afAuth.auth.currentUser.uid,
              displayName: user.name,
              photoURL: "https://www.freelogodesign.org/Content/img/logo-ex-7.png",
            })
          }).then(() => {
            resolve({ sucess: true })
          }).catch((err) => {
            reject(err)
          })
        }).catch((err) => {
          reject(err)
        }).catch(err => {
          reject(err)
        })
    })
    return promise
  }
  resetPassword(email) {
    var promis = new Promise((resolve, rejected) => {
      Firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          resolve({ success: true })
        }).catch((err) => {
          rejected(err)
        })
    })
    return promis
  }
  updateimage(imageurl) {
    var promise = new Promise((resolve, reject) => {
      this.afAuth.auth.currentUser.updateProfile({
        displayName: this.afAuth.auth.currentUser.displayName,
        photoURL: imageurl
      }).then(() => {
        Firebase.database().ref('/usersBD/' + Firebase.auth().currentUser.uid).update({
          displayName: this.afAuth.auth.currentUser.displayName,
          photoURL: imageurl,
          uid: Firebase.auth().currentUser.uid
        }).then(() => {
          resolve({ success: true });
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
  getuserdetails() {
    var promise = new Promise((resolve, reject) => {
      this.fireDB.child(Firebase.auth().currentUser.uid).once('value', (snapshot) => {
        resolve(snapshot.val());
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
  updatedisplayname(newname) {
    var promise = new Promise((resolve, reject) => {
      this.afAuth.auth.currentUser.updateProfile({
        displayName: newname,
        photoURL: this.afAuth.auth.currentUser.photoURL
      }).then(() => {
        this.fireDB.child(Firebase.auth().currentUser.uid).update({
          displayName: newname,
          photoURL: this.afAuth.auth.currentUser.photoURL,
          uid: this.afAuth.auth.currentUser.uid
        }).then(() => {
          resolve({ success: true });
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
  getallusers() {
    var promise = new Promise((resolve, reject) => {
      this.fireDB.orderByChild('uid').once('value', (snapshot) => {
        let userdata = snapshot.val();
        let temparr = [];
        for (var key in userdata) {
          temparr.push(userdata[key]);
        }
        resolve(temparr);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
}
