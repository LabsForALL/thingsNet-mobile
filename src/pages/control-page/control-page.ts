import {Component} from "@angular/core";
import {PeerService} from "../../services/peer-service/peer.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'control-page',
  templateUrl: 'control-page.html'
})
export class ControlPage {

  isServerConnected = false;
  isMediaConnected = false;
  isDataConnected = false;
  isBluetoothConnected = false;

  peerSubscription: Subscription;
  mediaSubscription: Subscription;
  dataSubscription: Subscription;

  constructor(public peerService: PeerService) { }


  /** Lifecycle callbacks */

  ionViewDidLoad() {

    console.log("Control page will enter");

    this.peerSubscription = this.peerService.isServerConnected.subscribe((isConnected)=>{
        this.isServerConnected = isConnected;
    });

    this.mediaSubscription = this.peerService.isMediaConnected.subscribe((isConnected)=>{
      this.isMediaConnected = isConnected;
    });

    this.dataSubscription = this.peerService.isDataConnected.subscribe((isConnected)=>{
      this.isDataConnected = isConnected;
    });

  }


  ionViewWillLeave() {
    console.log("control will page leave");
  }

  ionViewWillUnload() {
    console.log('Unloading control page');
    this.peerService.terminate();
    this.peerSubscription.unsubscribe();
    this.mediaSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }

}
