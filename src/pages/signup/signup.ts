import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  newuser = {
    name: "",
    email: "",
    password: ""
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProv: UserProvider,
    public toastCtrl: ToastController,
    public loaderCtrl: LoadingController
  ) {
  }
  goback() {
    this.navCtrl.setRoot("LoginPage")
  }
  signup() {
    var toast = this.toastCtrl.create({
      duration: 3000,
      position: "bottom"
    })
    if (this.newuser.email == '' || this.newuser.password == '' || this.newuser.name == '') {
      toast.setMessage("All fields Required")
      toast.present()
    } else if (this.newuser.password.length < 7) {
      toast.setMessage("password not strong try another")
      toast.present()
    } else {
      let load = this.loaderCtrl.create({
        content: "please wait"
      })
      load.present();
      this.userProv.addNewuser(this.newuser)
        .then((res: any) => {
          load.dismiss()
          if (res.sucess) {
            this.navCtrl.setRoot("ProfilePicPage")
          } else {
            alert(res)
          }
        })
    }

  }

}
