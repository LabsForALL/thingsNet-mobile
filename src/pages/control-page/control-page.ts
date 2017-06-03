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
//import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';



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
  isLandscaped: boolean;

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
              private screenOrientation: ScreenOrientation,) { }


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
        switch (this.screenOrientation.type) {

          case this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY:

            this.isLandscaped = true;
            this.changeDetector.detectChanges();
            break;

          case this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY:
            this.isLandscaped = false;
            this.changeDetector.detectChanges();
            break;

        }
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
    this.serverOn();
  }


  onPeerServiceDisconnected() {
    // able to reconnect

  }


  onPeerServiceClosed() {
    this.serverOff();
    //unable to create more connections
    this.navCtrl.popToRoot();
  }


  onPeerServiceError(errMsg: String, isFatal: boolean) {
    this.serverOff();
    this.alertHelper.showSimpleAlert('', errMsg.toString());
  }


  /** Data connection callbacks  */

  onPeerDataConnectionOpen() {
    this.dataOn()
  }


  onPeerDataConnectionClose() {
    this.dataOff();
  }


  onPeerDataConnectionError(err: any) {
    this.dataOff();
    this.alertHelper.showSimpleAlert('', err);
  }


  /** Media connection callbacks  */

  onPeerMediaConnectionOpen(stream: any) {

    this.videoDirective.setVideoStream(stream);
    console.log(stream);

    console.log(stream.getAudioTracks());



    navigator.mediaDevices.enumerateDevices()
      .then(this.gotDevices)
      .catch(err => console.log(err));

    /*
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      orientation: 'landscape'
    };

    this.streamingMedia.playVideo('https://path/to/video/stream', options);
    */

    this.mediaOn();
  }


  gotDevices(deviceInfos) {

    for (let i = 0; i !== deviceInfos.length; ++i) {

      let deviceInfo = deviceInfos[i];

      console.log(deviceInfo);

      let deviceId = deviceInfo.deviceId;

      if (deviceInfo.kind === 'audioinput') {
        console.log(deviceInfo.label);

      } else if (deviceInfo.kind === 'audiooutput') {
        console.log(deviceInfo.label);

      } else if (deviceInfo.kind === 'videoinput') {

        console.log(deviceInfo.label);

      } else {
        console.log('Some other kind of source/device: ', deviceInfo);
      }
    }

  }


  onPeerMediaConnectionClosed() {
    this.mediaOff();
  }


  onPeerMediaConnectionError(err: any) {
    this.mediaOff();
    this.alertHelper.showSimpleAlert('', err);
  }


  /** Helper methods */

  serverOn() {
    this.isServerConnected = true;
    this.changeDetector.detectChanges();
  }


  serverOff(){
    this.isServerConnected = false;
    this.changeDetector.detectChanges();
  }


  dataOn() {
    this.isDataConnected = true;
    this.changeDetector.detectChanges();

  }


  dataOff() {
    this.isDataConnected = false;
    this.changeDetector.detectChanges();
  }


  mediaOn(){
    this.isMediaConnected = true;
    this.changeDetector.detectChanges();
  }


  mediaOff(){
    this.isMediaConnected = false;
    this.changeDetector.detectChanges();
  }

}
