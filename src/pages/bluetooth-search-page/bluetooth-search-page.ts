import {ChangeDetectorRef, Component} from "@angular/core";
import {BluetoothService} from "../../services/bluetooth-service/bluetooth.service";
import {LoadingController, NavController} from "ionic-angular";
import {AlertHelper} from "../../helpers/alert-helper";
import {Subscription} from "rxjs/Subscription";


@Component({
  selector: 'bluetooth-search-page',
  templateUrl: 'bluetooth-search-page.html',
})
export class BluetoothSearchPage {

  pairedDevices: Array<{}>;
  foundDevices: Array<{}>;

  searchBtnText = "Search";
  isSearching = false;
  discoverySubscription: Subscription;


  constructor(
    public navCtrl: NavController,
    public bluetoothService: BluetoothService,
    public loadingController: LoadingController,
    public changeDetector: ChangeDetectorRef,
    public alertHelper: AlertHelper,) {
    this.foundDevices = [];
  }


  ionViewDidEnter() {

    //Coming from control page (already checked bluetooth aviability)
    this.bluetoothService.getPairedDevices().then(
      (devices) => {
        this.pairedDevices = devices;
      },
      () => {
        console.log('no paired devices found')
      }
    );

  }


  onSearch() {

    if(this.isSearching) return;
    console.log("started searching");

    this.discoverySubscription = this.bluetoothService.startDiscovery().subscribe(
      devices => {
        this.isSearching = true;
        this.searchBtnText = '';
        if(!devices) return;
        this.foundDevices = devices;
        this.changeDetector.detectChanges();
      },
      error => {
        this.alertHelper.showSimpleAlert("", error);
        this.offSearchingState();
      },
      () => {
        this.offSearchingState();
      }
    );

  }


  offSearchingState() {

    this.isSearching = false;
    this.searchBtnText = 'Search';
    this.changeDetector.detectChanges();
    this.discoverySubscription.unsubscribe();

  }


  onConnect(device) {

    // Blocking UI
    console.log("connecting");
    let loader = this.loadingController.create({
      content: "Connecting...",
    });

    loader.present();

    let connSubscription = this.bluetoothService.connect(device.id).subscribe(
      ()=>{
        this.navCtrl.pop();
        loader.dismiss();
        connSubscription.unsubscribe();
      },
      (errMsg)=>{
        this.alertHelper.showSimpleAlert("", errMsg);
        loader.dismiss();
        connSubscription.unsubscribe();
      },
      () => {
        console.log('bt conn completed');
        loader.dismiss();
        connSubscription.unsubscribe();
      }
    );

  }


  ionViewWillUnload(){
    if(this.discoverySubscription) this.discoverySubscription.unsubscribe();

  }

}
