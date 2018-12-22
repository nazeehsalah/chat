import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';
import { RequestsProvider } from '../../providers/requests/requests';

/**
 * Generated class for the GroupbuddiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groupbuddies',
  templateUrl: 'groupbuddies.html',
})
export class GroupbuddiesPage {

  myfriends = [];
  groupmembers = [];
  searchstring;
  tempmyfriends = [];
  newbuddy;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public requestprov: RequestsProvider,
    public events: Events,
    public groupprov: GroupsProvider
  ) {
  }

  ionViewWillEnter() {
    this.requestprov.getmyfriends();
    this.events.subscribe('gotintogroup', () => {
      this.myfriends.splice(this.myfriends.indexOf(this.newbuddy.uid), 1);
      this.tempmyfriends = this.myfriends;
    })
    this.events.subscribe('friends', () => {
      this.myfriends = [];
      this.myfriends = this.requestprov.myfriends;
      this.groupmembers = this.groupprov.currentgroup;
      for (var key in this.groupmembers)
        for (var friend in this.myfriends) {
          if (this.groupmembers[key].uid === this.myfriends[friend].uid)
            this.myfriends.splice(this.myfriends.indexOf(this.myfriends[friend]), 1);
        }
      this.tempmyfriends = this.myfriends;
    })
  }

  searchuser(searchbar) {
    let tempfriends = this.tempmyfriends;

    var q = searchbar.target.value;

    if (q.trim() === '') {
      this.myfriends = this.tempmyfriends;
      return;
    }

    tempfriends = tempfriends.filter((v) => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })

    this.myfriends = tempfriends;

  }

  addbuddy(buddy) {
    this.newbuddy = buddy;
    this.groupprov.addmember(buddy);
  }


}
