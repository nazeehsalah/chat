import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserCrads } from "../../models/userCreds"
import { AuthProvider } from '../../providers/auth/auth';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginData = {} as UserCrads
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProv: AuthProvider) {
      this.loginData.password="123456789"
      this.loginData.email="nazeeh@test.test"
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  resetPassword() {
    this.navCtrl.push("PasswordResetPage");
  }
  signup() {
    this.navCtrl.push("SignupPage");
  }
  login() {
    this.authProv.login(this.loginData)
      .then((res:any)=>{
        if(!res.code){
          this.navCtrl.setRoot("TabsPage")
        }else{
          alert(res)
        }
      })
  }
}
