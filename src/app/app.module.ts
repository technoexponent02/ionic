import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { MyApp } from './app.component';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Deeplinks } from '@ionic-native/deeplinks';
import { Stripe } from '@ionic-native/stripe';
import { Firebase } from '@ionic-native/firebase';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { File } from '@ionic-native/file';

import { HomePage } from '../pages/home/home';
import { PasswordPage } from '../pages/password/password';
import { ForgotPasswordPage } from '../pages/forgot_password/forgot_password';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ProfileSettingPage } from '../pages/profile_setting/profile_setting';
import { ChangePasswordPage } from '../pages/change_password/change_password';
import { ChangeProfileImagePage } from '../pages/change_profile_image/change_profile_image';
import { ChangeLocationPage } from '../pages/change_location/change_location';
import { CreatePasswordPage } from '../pages/create_password/create_password';
import { MyPetsPage } from '../pages/my_pets/my_pets';
import { AddPetPage } from '../pages/add_pet/add_pet';
import { MyInvoicesPage } from '../pages/my_invoices/my_invoices';
import { EditMyPetPage } from '../pages/edit_my_pet/edit_my_pet';
import { PaymentPage } from '../pages/payment/payment';
import { MyNotificationsPage } from '../pages/my_notifications/my_notifications';
import { ResetPasswordPage } from '../pages/reset_password/reset_password';

// import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PasswordPage,
    ForgotPasswordPage,
    DashboardPage,
    ProfileSettingPage,
    ChangePasswordPage,
    ChangeProfileImagePage,
    ChangeLocationPage,
    CreatePasswordPage,
    MyPetsPage,
    AddPetPage,
    MyInvoicesPage,
    EditMyPetPage,
    PaymentPage,
    MyNotificationsPage,
    ResetPasswordPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    IonicModule.forRoot(MyApp,{
      iconMode : 'ios'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PasswordPage,
    ForgotPasswordPage,
    DashboardPage,
    ProfileSettingPage,
    ChangePasswordPage,
    ChangeProfileImagePage,
    ChangeLocationPage,
    CreatePasswordPage,
    MyPetsPage,
    AddPetPage,
    MyInvoicesPage,
    EditMyPetPage,
    PaymentPage,
    MyNotificationsPage,
    ResetPasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    FileTransfer,
    ImagePicker,
    Facebook,
    PayPal,
    GooglePlus,
    Deeplinks,
    Stripe,
    Firebase,
    UniqueDeviceID,
    AndroidPermissions,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
