import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the PasswordResetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordResetPage {
  email: string
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProve: UserProvider,
    public alerCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordResetPage');
  }
  goback() {
    this.navCtrl.push("LoginPage")
  }
  resetPassword() {
    let alert = this.alerCtrl.create({
      buttons: ["ok"]
    })
    this.userProve.resetPassword(this.email).
      then((res: any) => {
        if (res.success) {
          alert.setTitle("Email Sent")
          alert.setMessage("Please follow instraction")
        } else {
          alert.setTitle("Failed")
        }
      })
  }
}
