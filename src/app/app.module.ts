import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { MyApp } from './app.component';
import { Firebase } from '@ionic-native/firebase';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AuthProvider } from '../providers/auth/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { UserProvider } from '../providers/user/user';
import { ImagesProvider } from '../providers/images/images';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { ChatProvider } from '../providers/chat/chat';
import { RequestsProvider } from '../providers/requests/requests';
import { GroupsProvider } from '../providers/groups/groups';

var config = {
  apiKey: "AIzaSyA7ZRdfwvuuEGJbQJ3NsUspVASyGVHPwlo",
  authDomain: "ramadan-7284f.firebaseapp.com",
  databaseURL: "https://ramadan-7284f.firebaseio.com",
  projectId: "ramadan-7284f",
  storageBucket: "ramadan-7284f.appspot.com",
  messagingSenderId: "412572190979"
};
@NgModule({
  declarations: [
    MyApp,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, { tabsPlacement: "top" }),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,

    ,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    UserProvider,
    ImagesProvider,
    File,
    FilePath,
    FileChooser,
    ChatProvider,
    RequestsProvider,
    GroupsProvider,
  ]
})
export class AppModule { }
