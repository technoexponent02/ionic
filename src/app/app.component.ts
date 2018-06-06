import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NavController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { CommonTasks } from './common_tasks/common_tasks';
import { ForgotPasswordService } from './common_tasks/forgot_password.webservice';
import { HomePage } from '../pages/home/home';
import { Deeplinks } from '@ionic-native/deeplinks';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { PaymentPage } from '../pages/payment/payment';
import { get } from '@ionic-native/core';
import { ResetPasswordPage } from '../pages/reset_password/reset_password';
import { MyInvoicesPage } from '../pages/my_invoices/my_invoices';

@Component({
  templateUrl: 'app.html',
  providers: [CommonTasks]
})
export class MyApp {
  rootPage: any = HomePage;
  private invoiceInfoServiceUrl: string = this.commonTasksObj.ROOT_URL + "editInvoicedata";
  private invoiceValidityServiceUrl: string = this.commonTasksObj.ROOT_URL + "check_payment_link";
  constructor(platform: Platform, private http: Http, statusBar: StatusBar, splashScreen: SplashScreen, deeplinks: Deeplinks, public commonTasksObj: CommonTasks) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      deeplinks.route({
        // '/about-us': AboutPage,
        // '/payment/:token': PaymentPage
        // '/products/:productId': ProductPage
      }).subscribe((match) => {
        // match.$route - the route we matched, which is the matched entry from the arguments to route()
        // match.$args - the args passed in the link
        // match.$link - the full link data
        console.log('Successfully matched route', match);
        console.log(match.$link.path);
        console.log(match.$link.url);
      }, (nomatch) => {
        // nomatch.$link - the full link data
        console.error('Got a deeplink that didn\'t match', nomatch);
        console.log(nomatch.$link.path);
        console.log(nomatch.$link.url);
        var path = nomatch.$link.path;
        var desiredPage = path.split("/")[1];
        console.log(desiredPage);
        if (desiredPage == "payment") {
          var desiredToken = (path.split("/payment/")[1]).split("/")[0];
          var desiredInvoiceId = (path.split("/payment/")[1]).split("/")[1];
          console.log(desiredToken);
          console.log(desiredInvoiceId);
          if(localStorage.getItem("USERTOKEN")!=undefined){
            if(desiredToken==localStorage.getItem("USERTOKEN")){
              this.verifyUserToken(desiredToken, desiredInvoiceId);
            }
            else{
              this.commonTasksObj.displaySimpleToast("The Invoice generated is not for the currently Logged In User ");
            }
          }else{
              this.commonTasksObj.displaySimpleToast("Please Login, and hit the link again");
          }
        }
        else if(desiredPage=="forgotpassword"){
          var desiredToken = (path.split("/forgotpassword/")[1]).split("/")[0];
          if(localStorage.getItem("USERTOKEN")!=undefined){
            this.commonTasksObj.displaySimpleToast("A user is already Logged In. Please Logout and hit the link again.");
          }else{
              // this.commonTasksObj.displaySimpleToast("Please Login.");
              localStorage.setItem("FORGOTPASSWORDUSERTOKEN",desiredToken);
              this.rootPage = ResetPasswordPage;
          }
        }
        else{

        }
      });
    });
  }

  //*** for verifying user token ***//
  verifyUserToken(userToken, invoiceID) {
    this.commonTasksObj.displayLoader("");
    console.log("Hello");
    console.log(this.invoiceValidityServiceUrl);

    var form = new FormData();
    // token, inv_id
    form.append("token", userToken);
    form.append("inv_id", invoiceID);
    this.http.post(this.invoiceValidityServiceUrl, form)
      .subscribe(data => {
        console.log(data['_body']);
        var dataObj = JSON.parse(data['_body']);
        console.log(dataObj);
        if (dataObj.status_code == 0 && dataObj.paid_status=="N") {
          this.commonTasksObj.dismissLoader();
          this.gotoPaymentsPageWithInvoiceInfo(invoiceID);
        }
        else if(dataObj.status_code == 0 && dataObj.paid_status=="Y"){
          this.commonTasksObj.dismissLoader();
          this.commonTasksObj.displaySimpleToast("You have already paid for this Invoice.");
          this.rootPage = MyInvoicesPage;
        } 
        else {
          this.commonTasksObj.dismissLoader();
          this.commonTasksObj.displaySimpleToast(dataObj.message);
        }
      }, error => {
        this.commonTasksObj.dismissLoader();
        console.log(error);// Error getting the data
      });
  }

  //*** for getting invoice data and going to payments page ***//
  gotoPaymentsPageWithInvoiceInfo(invID) {
    var form = new FormData();
    form.append("invID", invID);
    this.http.post(this.invoiceInfoServiceUrl, form)
      .subscribe(data => {
        console.log(data['_body']);
        var dataObj = JSON.parse(data['_body']);
        console.log(dataObj);
        if (dataObj.status_code == "1") {
          localStorage.setItem("PAYFORINVOICEID", dataObj.invoice.invoiceID);
          localStorage.setItem("PAYTOTALAMOUNT", dataObj.invoice.total);
          localStorage.setItem("PAYFORDOCTORNAME", dataObj.invoice.name);
          localStorage.setItem("PAYFORDOCTORID", dataObj.invoice.uid);
          if (dataObj.invoice.profile_picture_doc == null) {
            localStorage.setItem("PAYFORDOCTORPROFILEPICTURE", "./assets/images/doctor_user.png");
          }
          else {
            localStorage.setItem("PAYFORDOCTORPROFILEPICTURE", this.commonTasksObj.PROFILE_PIC_ROOT_URL + dataObj.invoice.profile_picture_doc);
          }
          localStorage.setItem("DOCTORPAYPALPROID",dataObj.invoice.sandbox_clientID);
          localStorage.setItem("DOCTORPAYPALSUBID",dataObj.invoice.production_clientID);
          localStorage.setItem("DOCTORSTRIPEID",dataObj.invoice.stripe_publishable_key);
          this.rootPage = PaymentPage;
        }
      }, error => {
        console.log(error);// Error getting the data
        return false;
      });
  }
}
