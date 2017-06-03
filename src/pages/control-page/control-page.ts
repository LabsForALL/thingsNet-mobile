import {ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {PeerService} from "../../services/peer-service/peer.service";
import {NavController} from "ionic-angular";
import {AlertHelper} from "../../helpers/alert-helper";
import {BluetoothSearchPage} from "../bluetooth-search-page/bluetooth-search-page";
import {BluetoothService} from "../../services/bluetooth-service/bluetooth.service";
import {IPeerServiceListeners} from "../../services/peer-service/peer-service.interfaces";
import {Subscription} from "rxjs/Subscription";
import {VideoDirective} from "./video.directive";
import { ScreenOrientation } from '@ionic-native/screen-orientation';


@Component({
  selector: 'control-page',
  templateUrl: 'control-page.html',
  providers: [ScreenOrientation]
})
export class ControlPage implements IPeerServiceListeners {

  @ViewChild(VideoDirective) videoDirective; // First

  username: any;
  btBadgeText: any;
  isBtConnected: boolean;

  sensorsToggleState = false;
  locationToggleState = false;
  batteryToggleState = false;

  isServerConnected: boolean = true;
  isDataConnected: boolean = false;
  isMediaConnected: boolean = false;

  bluetoothSubscription: Subscription;
  screenOrientationSubscription: Subscription;
  constructor(public navCtrl: NavController,
              public alertHelper: AlertHelper,
              public changeDetector: ChangeDetectorRef,
              public bluetoothService: BluetoothService,
              public peerService: PeerService,
              private screenOrientation: ScreenOrientation) { }


  /** Lifecycle callbacks */

  ionViewDidLoad() {

    this.bluetoothSubscription = this.bluetoothService.isConnected.subscribe(
      isConnected=>{
        if(isConnected){
          this.btBadgeText = 'Disconnect';
        } else {
          this.btBadgeText = 'Connect';
        }
        this.isBtConnected = isConnected;
      },
      err => {
        console.log(err);
        this.isBtConnected = false;
        this.btBadgeText = 'Connect';
      },
      () => {
        this.isBtConnected = false;
        this.btBadgeText = 'Connect';
      }
    );

    this.peerService.setListener(this);
    this.username = this.peerService.getUsername();


    // get current

    this.screenOrientationSubscription = this.screenOrientation.onChange().subscribe(
      () => {
        console.log(this.screenOrientation.type);
      },
      err => {
        console.log(err);
        this.screenOrientationSubscription.unsubscribe();
      },
      () => {
        console.log(' so complete');
        this.screenOrientationSubscription.unsubscribe();
      }
    )


  }


  ionViewWillUnload() {
    this.screenOrientationSubscription.unsubscribe();
    this.bluetoothSubscription.unsubscribe();
    this.peerService.terminate();
    this.peerService.removeAllListeners();
  }


  /** UI Events */

  openBluetoothPage(){

    this.bluetoothService.checkAviability().then(
      () => {
        this.navCtrl.push(BluetoothSearchPage);
      },
      (errMsg) => {
        this.alertHelper.showSimpleAlert("",errMsg);
      }
    );

  }


  disconectBt() {
    this.bluetoothService.closeConnection();
  }


  onBatteryToggled(){




  }


  onSensorsToggled(){



  }


  onLocationToggled(){



  }


  /** Peer service callbacks */

  onPeerServiceOpen(regName: String) {
    this.isServerConnected = true;
    this.changeDetector.detectChanges();
  }


  onPeerServiceDisconnected() {
    // able to reconnect
    this.isServerConnected = false;
    this.changeDetector.detectChanges();
  }


  onPeerServiceClosed() {
    this.isServerConnected = false;
    this.changeDetector.detectChanges();
    //unable to create more connections
    this.navCtrl.popToRoot();
  }


  onPeerServiceError(errMsg: String, isFatal: boolean) {
    this.isServerConnected = false;
    this.changeDetector.detectChanges();
    this.alertHelper.showSimpleAlert('', errMsg.toString());
  }


  /** Data connection callbacks  */

  onPeerDataConnectionOpen() {
    this.isDataConnected = true;
    this.changeDetector.detectChanges();
  }


  onPeerDataConnectionClose() {
    this.isDataConnected = false;
    this.changeDetector.detectChanges();
  }


  onPeerDataConnectionError(err: any) {
    this.isDataConnected = false;
    this.changeDetector.detectChanges();
    this.alertHelper.showSimpleAlert('', err);
  }


  /** Media connection callbacks  */

  onPeerMediaConnectionOpen(stream: any) {
    this.isMediaConnected = true;
    this.videoDirective.setVideoStream(stream);
    this.changeDetector.detectChanges();
  }


  onPeerMediaConnectionClosed() {
    this.isMediaConnected = false;
    this.changeDetector.detectChanges();
  }


  onPeerMediaConnectionError(err: any) {
    this.isMediaConnected = false;
    this.changeDetector.detectChanges();
    this.alertHelper.showSimpleAlert('', err);
  }

}
