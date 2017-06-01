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
            name: 'name',
            placeholder: '...'
          },
          {
            name: 'pass',
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
              if (data.name.length > 0) resolve(data.name);
              else return false;
            }
          }
        ]
      }).present().catch( reject );

    });

  }

  showConnectPeerPrompt(){

    return new Promise((resolve, reject) => {

      this.alertCtrl.create({

        message: "Enter remote peer name:",
        enableBackdropDismiss: false,
        inputs: [
          {
            name: 'peerName',
            placeholder: '...'
          }
        ],

        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Connect',
            handler: data => {
              if (data.peerName.length > 0) resolve(data.peerName);
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
