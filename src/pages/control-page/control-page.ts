import {ChangeDetectorRef, Component} from "@angular/core";
import {PeerService} from "../../services/peer-service/peer.service";
import {NavController} from "ionic-angular";
import {AlertHelper} from "../../helpers/alert-helper";
import {BluetoothSearchPage} from "../bluetooth-search-page/bluetooth-search-page";
import {BluetoothService} from "../../services/bluetooth-service/bluetooth.service";


@Component({
  selector: 'control-page',
  templateUrl: 'control-page.html'
})
export class ControlPage {

  sensorsToggleState = false;
  locationToggleState = false;
  robotToggleState = false;


  constructor(public navCtrl: NavController,
              public alertHelper: AlertHelper,
              public changeDetector: ChangeDetectorRef,
              public bluetoothService: BluetoothService,
              public peerService: PeerService,) { }


  /** Lifecycle callbacks */

  ionViewDidLoad() {


  }

  /** UI Events */

  onServerPage() {
  }


  onPeerPage() {
  }


  onRobotToggled() {

    this.bluetoothService.checkAviability().then(
      () => {
        this.navCtrl.push(BluetoothSearchPage);
      },
      (errMsg) => {
        this.alertHelper.showSimpleAlert("",errMsg);
      }
    );

  }


  onSensorsToggled(){

  }


  onLocationToggled(){

  }

  ionViewWillUnload() {


  }

}
