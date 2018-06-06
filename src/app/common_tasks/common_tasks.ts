import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import 'rxjs/Rx';
import { NavController } from 'ionic-angular';

import { Http, Headers} from '@angular/http';
import {PaymentPage} from '../../pages/payment/payment';

@Injectable()

export class CommonTasks{
    public loadingObj : any;
    constructor(public toastCtrl : ToastController, public loadingCtrl : LoadingController, private http : Http){
      
    }
    
    private invoiceValidityServiceUrl : string;
    private invoiceInfoServiceUrl : string;
   
    //*** for displaying simple toast messages ***//
    displaySimpleToast( message ) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top',
            dismissOnPageChange: false,
        });
        
        toast.onDidDismiss(() => {
            // console.log('Dismissed toast');
        });
        
        toast.present();
    }

    //*** for displaying important toast messages ***//
    displayImportantToast(message){
        let toast = this.toastCtrl.create({
            message: message,
            position: 'top',
            showCloseButton: true,
            dismissOnPageChange: false
        });
        
        toast.onDidDismiss(() => {
            // console.log('Dismissed toast');
        });
        
        toast.present();
    }

    //*** for validating Emails ***//
    validateEmail(email){
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
        if(email.match(mailformat))  
        {  
            console.log("Valid Email");
            return true;  
        }  
        else  
        {  
        console.log("Invalid Email"); 
        return false;  
        }  
    }

    //*** for loader ***//
    displayLoader( message : any){
        if(message == ""){
            message = "Please Wait...";
        }

        this.loadingObj = this.loadingCtrl.create({
            content: message
        });
    
        this.loadingObj.present();

    }

    dismissLoader(){
        this.loadingObj.dismiss();
    }

  
}