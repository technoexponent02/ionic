import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CommonTasks} from '../../app/common_tasks/common_tasks';
import { Http, Headers } from '@angular/http';

// import {ForgotPasswordService} from '../../app/common_tasks/forgot_password.webservice';


@Component({
    selector: 'page-forgot_password',
    templateUrl: 'forgot_password.html',
})

export class ForgotPasswordPage{
    constructor(public navCtrl: NavController, public http : Http, public commonTasksObj: CommonTasks ){
        
    }
    
    public email: String ;
    public forgotPasswordServiceUrl : string;

    gotoSignInPage(){
        this.navCtrl.pop();
    }


    forgotPasswordProcess(){
        var email = this.email;
        if(email=="" || email==undefined){
            this.commonTasksObj.displaySimpleToast("Please enter your Email Id.");
            return false;
        }
        else{
            var emailValidity = this.commonTasksObj.validateEmail(email);
            if(emailValidity==false){
                this.commonTasksObj.displaySimpleToast("Please enter a valid Email");
            }
            else{
                this.forgotPasswordProcessForUser(this.email);
            }
            
        }
       
    }

    forgotPasswordProcessForUser(email){
       
        var form = new FormData();
        form.append("emailAddress", email);
        
        this.http.post(this.forgotPasswordServiceUrl, form)
          .subscribe(data => {
            console.log(data['_body']);
            var dataObj = JSON.parse(data['_body']);
            console.log(dataObj);
            if(dataObj.status_code==0){
                 this.commonTasksObj.displayImportantToast(dataObj.message);
            }
            else{
                 this.commonTasksObj.displayImportantToast(dataObj.message);
            }
           }, error => {
            console.log(error);// Error getting the data
            this.commonTasksObj.displaySimpleToast("Some Error Occured, Please try again.");
          });
    }

}