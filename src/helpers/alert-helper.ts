import { AlertController } from 'ionic-angular';
import { Injectable } from "@angular/core";

@Injectable()
export class AlertHelper {

  constructor(
    public alertCtrl: AlertController
  ){ }


  showRegistrationPrompt(){

    return new Promise((resolve, reject) => {

      this.alertCtrl.create({

        title: 'Registration',
        message: "Enter a name for your robot.",
        enableBackdropDismiss: false,
        inputs: [
          {
            name: 'robotName',
            placeholder: '...'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Register',
            handler: data => {
              //TODO: add validation
              if (data.robotName.length > 0) resolve(data.robotName);
              else return false;
            }
          }
        ]
      }).present().catch( reject );

    });

  }

  showSimpleAlert(title: string, subtitle: string){
    return this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['Dismiss']
    }).present();
  }



}
