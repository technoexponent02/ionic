import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import {CommonTasks} from '../../app/common_tasks/common_tasks';

@Injectable()
export class ForgotPasswordService{
    
    private serviceUrl : string;

    constructor( public http :Http, public commonTasksObj: CommonTasks){
      
    }

   forgotPasswordProcessForUser(email){
       
       var form = new FormData();
       form.append("emailAddress", email);
       
       this.http.post(this.serviceUrl, form)
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