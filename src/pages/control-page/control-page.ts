import {ChangeDetectorRef, Component} from "@angular/core";
import {PeerService} from "../../services/peer-service/peer.service";
import {Subscription} from "rxjs/Subscription";
import {NavController} from "ionic-angular";
import {AlertHelper} from "../../helpers/alert-helper";
import {BluetoothSearchPage} from "../bluetooth-search-page/bluetooth-search-page";
import {BluetoothService} from "../../services/bluetooth-service/bluetooth.service";

@Component({
  selector: 'control-page',
  templateUrl: 'control-page.html'
})
export class ControlPage {

  isServerConnected = false;
  isMediaConnected = false;
  isDataConnected = false;
  isBluetoothConnected = false;

  serviceStateSubscription: Subscription;
  mediaStateSubscription: Subscription;
  dataStateSubscription: Subscription;
  dataStreamSubscription: Subscription;
  bluetoothConnSubscription: Subscription;

  constructor(public peerService: PeerService,
              public navCtrl: NavController,
              public alertHelper: AlertHelper,
              public changeDetector: ChangeDetectorRef,
              public bluetoothService: BluetoothService) {
  }


  /** Lifecycle callbacks */

  ionViewDidLoad() {

    console.log("Control page loaded");

    this.serviceStateSubscription = this.peerService.isServerConnected.subscribe((isConnected)=>{
        this.isServerConnected = isConnected;
        this.changeDetector.detectChanges();
        if(!isConnected) {
          this.navCtrl.pop();
        }
    });


    this.bluetoothConnSubscription = this.bluetoothService.isConnected.subscribe(
      value=>{
        this.isBluetoothConnected = value;
        this.changeDetector.detectChanges();
      },
      err =>{
        console.log(err);
        this.isBluetoothConnected = false;
        this.changeDetector.detectChanges();
      },
      () => {
        this.isBluetoothConnected = false;
        this.changeDetector.detectChanges();
      }
    );


    this.mediaStateSubscription = this.peerService.isMediaConnected.subscribe((isConnected)=>{
      this.isMediaConnected = isConnected;
      this.changeDetector.detectChanges();
    });


    this.dataStateSubscription = this.peerService.isDataConnected.subscribe((isConnected)=>{
      this.isDataConnected = isConnected;
      this.changeDetector.detectChanges();
    });


    this.dataStreamSubscription = this.peerService.dataStream.subscribe((data)=>{
      console.log(data);
      //{type: "COMMAND", command: "f"}
    });

  }


  onConnectBtnClicked() {
    this.alertHelper.showConnectPeerPrompt().then(
      (usrName) => {
        //this.peerService.callPeer(usrName);
      }
    ).catch(
      () => {
        console.log("alert helper error");
      }
    );
  }


  onServerChange() {

    if(this.isServerConnected){

    }



  }


  onBluetoothChange() {

    if(this.isBluetoothConnected){

      this.bluetoothService.checkAviability().then(
        () => {
          this.navCtrl.push(BluetoothSearchPage);
        },
        (errMsg) => {
          this.alertHelper.showSimpleAlert("",errMsg);
          let to = setTimeout(()=>{
            this.isBluetoothConnected = false;
            clearTimeout(to);
          },10);
        }
      );

    }else {
      console.log('diconnecting');
      this.bluetoothService.closeConnection();
    }

  }

  ionViewWillUnload() {
    console.log('Unloading control page');
    this.serviceStateSubscription.unsubscribe();
    this.mediaStateSubscription.unsubscribe();
    this.dataStateSubscription.unsubscribe();
    this.dataStreamSubscription.unsubscribe();
    this.bluetoothConnSubscription.unsubscribe();
    this.peerService.terminate();
  }

}
