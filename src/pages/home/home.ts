import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CommonTasks} from '../../app/common_tasks/common_tasks';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Firebase } from '@ionic-native/firebase';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import { PasswordPage } from '../password/password';
import { CreatePasswordPage } from '../create_password/create_password';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private googlePlus: GooglePlus, public commonTasksObj : CommonTasks, private http: Http, private fbObj : Facebook, private firebase: Firebase, private uniqueDeviceID: UniqueDeviceID) {
  
  }
  private serviceUrl : string;
  public email: String;
  public userFacebookLoginDetail : any;
  private fbLoginUrl : string;

  ionViewDidEnter(){
    localStorage.removeItem("USERENTEREDEMAIL");
    if(localStorage.getItem("USERLOGGEDIN")=="1"){
      this.navCtrl.push(DashboardPage);
    }
    this.firebase.getToken()
    .then(token =>localStorage.setItem("FCMTOKEN",token.toString())) // save the token server-side and use it to push notifications to this device
    .catch(error => console.error('Error getting token', error));
    console.log(localStorage.getItem("FCMTOKEN"));
    this.uniqueDeviceID.get()
    .then((uuid: any) => localStorage.setItem("UUID",uuid))
    .catch((error: any) => console.log(error));
  // Firebase.onNotificationOpen() .subscribe(res => { if(res.tap) { // background mode console.log("background"); console.log(res); } else if (!res.tap) { // foreground mode console.log("foreground"); console.log(res); } });
}

  gotoPasswordPage(){
    console.log(this.email);
    if(this.email=="" || this.email==undefined){
      this.commonTasksObj.displaySimpleToast("Please enter your Email Id.");
      return false;
  }
  else{
    var emailValidity = this.commonTasksObj.validateEmail(this.email.trim());
    if(emailValidity==false){
        this.commonTasksObj.displaySimpleToast("Please enter a valid Email");
    }
    else{
          var email = this.email.trim();
          this.preSignInProcess(email);
    }
    
  } 
  }

  signInFacebook(){

  }

  preSignInProcess(email: any){
   
    var form = new FormData();
    form.append("emailAddress", email);
    form.append("userType", "3");

    this.http.post(this.serviceUrl, form)
    .subscribe(data => {
      console.log(data['_body']);
      var dataObj = JSON.parse(data['_body']);
      console.log(dataObj);
      
      if(dataObj.status_code==0){
        localStorage.setItem("USERENTEREDEMAIL", email);
        this.commonTasksObj.displaySimpleToast(dataObj.message);
        if(dataObj.message=="login"){
          this.navCtrl.push(PasswordPage);
        }
        else if(dataObj.message=="register"){
          this.navCtrl.push(CreatePasswordPage);
        }
        else{

        }
      }

    }, error => {
     console.log(error);// Error getting the data
     this.commonTasksObj.displaySimpleToast("Some Error Occured, Please try again.");
   });
  }

  desiredredirect(){
    this.navCtrl.push(PasswordPage);
  }

  gotoDashboard(){
    this.navCtrl.push(DashboardPage);
  }

  gotoCreatePasswordPage(){
    this.navCtrl.push(CreatePasswordPage);
  }

  signInUserFacebook(){
    this.fbObj.login(['public_profile', 'user_friends', 'email'])
    .then((res: FacebookLoginResponse) =>localStorage.setItem("USERFACEBOOKLOGINDETAIL", JSON.stringify(res)))
    .catch(e => console.log('Error logging into Facebook', e));
    
    console.log(localStorage.getItem("USERFACEBOOKLOGINDETAIL"));
    this.userFacebookLoginDetail = JSON.parse(localStorage.getItem("USERFACEBOOKLOGINDETAIL"));
    console.log(this.userFacebookLoginDetail);
    var userID = this.userFacebookLoginDetail.authResponse.userID;
    console.log(userID);   
    // alert(localStorage.getItem("USERFACEBOOKLOGINDETAIL")); 

    this.fbObj.api('/'+userID+'?fields=name,gender,email',[]).then((response:FacebookLoginResponse)=>localStorage.setItem("USERFACEBOOKDETAILS",JSON.stringify(response)));
    this.userFacebookLoginDetail = JSON.parse(localStorage.getItem("USERFACEBOOKDETAILS"));
    console.log(this.userFacebookLoginDetail);
    this.loginThroughSocialLink(this.userFacebookLoginDetail.email, this.userFacebookLoginDetail.name );
  
  }

  signInUserGmail(){
    var gmailResponse;
    this.googlePlus.login({})
    .then(res => localStorage.setItem("USERGOOGLELOGINDETAILS", JSON.stringify(res)) )
    .catch(err => console.error(err));
    gmailResponse = JSON.parse(localStorage.getItem("USERGOOGLELOGINDETAILS"));
    console.log(gmailResponse);
    this.loginThroughSocialLink(gmailResponse.email, gmailResponse.displayName);

  }

  loginThroughSocialLink(email, name){
    var form = new FormData();
    form.append("emailAddress", email);
    form.append("userType", "2");
    form.append("name", name);
    form.append("fcmtoken", localStorage.getItem("FCMTOKEN"));
    form.append("deviceId",localStorage.getItem("UUID"));
    form.append("flag","A");

    this.http.post(this.fbLoginUrl, form)
    .subscribe(data => {
        console.log(data['_body']);
        var dataObj = JSON.parse(data['_body']);
        var userObj = dataObj.user_data;
        // this.commonTasksObj.displayImportantToast(dataObj.message);
        localStorage.setItem("USERLOGGEDIN","1");
        localStorage.setItem("USERDOB",userObj.dob);
        localStorage.setItem("USEREMAIL",userObj.emailAddress);
        localStorage.setItem("USERNAME",userObj.name);
        localStorage.setItem("USERMOBILENO",userObj.phone);
        localStorage.setItem("USERGENDER", userObj.gender);
        localStorage.setItem("USERID",userObj.id);
        localStorage.setItem("USERACCOUNTBALANCE",userObj.account_balance);
        localStorage.setItem("USERSTREET",userObj.address1);
        localStorage.setItem("USERCITY",userObj.city);
        localStorage.setItem("USERCOUNTRY",userObj.country);
        localStorage.setItem("USERZIPCODE",userObj.zipcode);
        localStorage.setItem("USERSTATE",userObj.state);
        this.navCtrl.push(DashboardPage);
        
    }, error => {
        console.log(error);// Error getting the data
    });
  }

}
