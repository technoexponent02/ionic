import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CommonTasks} from '../../app/common_tasks/common_tasks';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';
import {ProfileSettingPage} from '../profile_setting/profile_setting';
import {ChangePasswordPage} from '../change_password/change_password';
import {ChangeProfileImagePage} from '../change_profile_image/change_profile_image';
import {ChangeLocationPage} from '../change_location/change_location';
import { MyPetsPage } from '../my_pets/my_pets';
import { MyInvoicesPage } from '../my_invoices/my_invoices';
import { MyNotificationsPage } from '../my_notifications/my_notifications';
import { HomePage } from '../home/home';

@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html'
})

export class DashboardPage{
    private fetchProfileImageServiceUrl: string;
    public imageURL: any;
    public doctorName : string;
    public doctorEmail : string;
    public logoutServiceUrl : string;
    constructor( public navCtrl: NavController,  private http: Http, public commonTasksObj: CommonTasks){
       
    }
    
    ionViewDidEnter() {
        var form = new FormData();
        form.append("user_id", localStorage.getItem("USERID"));
        this.http.post(this.fetchProfileImageServiceUrl, form)
            .subscribe(data => {
                console.log(data['_body']);
                var dataObj = JSON.parse(data['_body']);
                console.log(dataObj.profile_image);
                var profileImageUrl = dataObj.profile_image;
                var lastChar = profileImageUrl[profileImageUrl.length - 1];
                console.log(lastChar);
                if (lastChar == "/") {
                    this.imageURL = "./assets/images/doctor_user.png";
                }
                else {
                    this.imageURL = profileImageUrl;
                }
            }, error => {
                console.log(error);// Error getting the data
                this.imageURL = "./assets/images/doctor_user.png";
                this.commonTasksObj.displaySimpleToast("Some Error Occured, while loading the profile image");
            });

            this.doctorName = localStorage.getItem("USERNAME");
            this.doctorEmail = localStorage.getItem("USEREMAIL");

    }

   gotoProfileSettingPage(){
       this.navCtrl.push(ProfileSettingPage);
   }
   gotoChangePasswordPage(){
       this.navCtrl.push(ChangePasswordPage);
   }

   gotoChangeProfileImagePage(){
       this.navCtrl.push(ChangeProfileImagePage);
   }

   gotoChangeLocationPage(){
       this.navCtrl.push(ChangeLocationPage);
   }

    gotoMyPetsPage(){
        this.navCtrl.push(MyPetsPage);
    }

    gotoMyInvoicesPage(){
        this.navCtrl.push(MyInvoicesPage);
    }

    gotoMyNotificationsPage(){
        this.navCtrl.push(MyNotificationsPage);
    }

    logout(){
        localStorage.removeItem("USERLOGGEDIN");
        var form = new FormData();
        // userId,fcmtoken,deviceId
        form.append("userId", localStorage.getItem("USERID"));
        form.append("fcmtoken", localStorage.getItem("FCMTOKEN"));
        form.append("deviceId", localStorage.getItem("UUID"));
        this.http.post(this.logoutServiceUrl, form)
            .subscribe(data => {
                console.log(data['_body']);
                var dataObj = JSON.parse(data['_body']);
                localStorage.removeItem("USERTOKEN");
            }, error => {
                this.commonTasksObj.displaySimpleToast("Some Error Occured, while loading the profile image");
            });
        this.navCtrl.push(HomePage);
    }
}
