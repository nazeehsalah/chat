import { UserCrads } from './../../models/userCreds';
import { Injectable } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth'
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(
    public afAuth:AngularFireAuth
  ) {
    console.log('Hello AuthProvider Provider');
  }
  login(cred:UserCrads){
    var promise=new Promise((resolve,reject)=>{
      this.afAuth.auth.signInWithEmailAndPassword(cred.email,cred.password).then(()=>{
        resolve(true)
      }).catch((err)=>{
        reject(err)
      })
    })
    return promise
  }
}
