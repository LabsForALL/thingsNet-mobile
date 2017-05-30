import { Injectable } from '@angular/core';
import { IBluetoothServiceListener } from './bluetooth-service.interfaces'
import {BluetoothSerial} from "@ionic-native/bluetooth-serial";

@Injectable()
export class BluetoothService{

    private connectionObservable: any = undefined;
    private serviceListener: IBluetoothServiceListener = undefined;

    public Commands = {
      moveForward : 'f',
      moveBackward : 'b',
      stopMove : 's',
      turnLeft : 'l',
      turnRight : 'r'
    };


    constructor(private bluetoothSerial: BluetoothSerial) { }


    setServiceListener(observer: IBluetoothServiceListener){
      this.serviceListener = observer;
    }


    removeServiceListener(){
      this.serviceListener = undefined;
    }


    checkModuleState(){
      this.bluetoothSerial.isEnabled().then(
        () => {
          if(this.serviceListener)
            this.serviceListener.onBluetoothModuleOn();
        },
        () => {
          if(this.serviceListener)
            this.serviceListener.onBluetoothModuleOff();
        }
      )
    }


    getPairedDevices(){
      this.bluetoothSerial.list().then(
        (devices) => {
          if(this.serviceListener)
            this.serviceListener.onPairedDevicesFound(devices);
        },
        () => {
          if(this.serviceListener)
            this.serviceListener.onPairedDevicesError();
        }
      );
    }


    startSearching(){

      this.bluetoothSerial.discoverUnpaired().then(
          (devices) => {
            if(this.serviceListener)
              this.serviceListener.onSearchFinished(devices);
            searchObservable.unsubscribe();
          },
          () =>{
            if(this.serviceListener)
              this.serviceListener.onSearchError();
            searchObservable.unsubscribe();
          }
      );

      let searchObservable = this.bluetoothSerial.setDeviceDiscoveredListener().subscribe(
        (device) =>{
          if(this.serviceListener)
            this.serviceListener.onSearchFound(device);
        }
      );

    }


    connectInsecure(id){

      this.connectionObservable = this.bluetoothSerial.connectInsecure(id).subscribe(
        ()=>{
          if(this.serviceListener)
            this.serviceListener.onConnectionSuccess();
        },
        ()=>{
          if(this.serviceListener)
            this.serviceListener.onConnectionError();
        }
      );

    }


    closeConnection(){

      this.bluetoothSerial.disconnect().then(
        () => {
          if(this.serviceListener)
            this.serviceListener.onConnectionClosed();
        }
      );

      this.connectionObservable.unsubscribe();

    }


    sendData(data){

      this.bluetoothSerial.write(data).then(
        ()=>{
          if(this.serviceListener)
            this.serviceListener.onCommandSend();
        },
        ()=>{
          if(this.serviceListener)
            this.serviceListener.onConnectionError();
        }
      );

    }

}
