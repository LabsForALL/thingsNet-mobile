import { Injectable } from '@angular/core';
import {BluetoothSerial} from "@ionic-native/bluetooth-serial";
import {Observable} from "rxjs/Observable";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {Subscription} from "rxjs/Subscription";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class BluetoothService{

    public Commands = {
      moveForward : 'f',
      moveBackward : 'b',
      stopMove : 's',
      turnLeft : 'l',
      turnRight : 'r'
    };

    connSubscription: Subscription;
    isConnected: BehaviorSubject<boolean> = new BehaviorSubject(false);


    constructor(private bluetoothSerial: BluetoothSerial,
                private androidPermissions: AndroidPermissions) { }


    checkAviability() : Promise<any> {

      return new Promise((resolve, reject) => {

        // checking permissions and bluetooth module

        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN).then(
          ()=> {
            this.checkModule(this,resolve, reject);
          },
          () => {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN).then(

              ()=> {
                this.checkModule(this,resolve, reject);
              },

              () => {
                reject("Please grant bluetooth permissions");
              }

            );
          }
        );

      });

    }


    private checkModule(self, resolve, reject) {

      self.bluetoothSerial.isEnabled().then(
        ()=>{
          resolve();
        },
        ()=>{
          // trying to enable module and then push
          self.bluetoothSerial.enable().then(
            ()=>{
              resolve();
            },
            ()=>{
              reject("Please enable bluetooth module");
            }
          );
        }
      );

    }


    startDiscovery() : Observable<any>{

      return new Observable(observer => {

        this.checkAviability().then(

          () => {
            // Starting discovery
            let discoverySubscription;

            this.bluetoothSerial.discoverUnpaired().then(
              (devices) => {
                observer.next(devices);
                observer.complete();
                discoverySubscription.unsubscribe();
              },
              () =>{
                observer.error("Searching failed");
                discoverySubscription.unsubscribe();
              });

            discoverySubscription = this.bluetoothSerial.setDeviceDiscoveredListener()
              .subscribe((device)=>{
                observer.next(device);
              });

            observer.next();
          },

          (errMsg) => {
            observer.error(errMsg);
          }
        );

      });

    }


    connect(id): Observable<any>{
      return new Observable( observer => {

        this.checkAviability().then(
          () => {
            //  Subscribe to connect, unsubscribe to disconnect.
            this.connSubscription = this.bluetoothSerial.connect(id).subscribe(
              () => {
                // Keeping connection alive
                this.isConnected.next(true);
                observer.next(true);
              },
              () => {
                this.connSubscription.unsubscribe();
                this.isConnected.next(false);
                observer.error("connection problem");
              },
              () => {
                this.connSubscription.unsubscribe();
                this.isConnected.next(false);
                observer.complete();
              }
            );

          },
          (errMsg) => {
            observer.error(errMsg);
        });

      });

    }


    getPairedDevices() : Promise<any>{
      return this.bluetoothSerial.list();
    }


    closeConnection() {
      this.bluetoothSerial.disconnect().then(
        () => {
          this.isConnected.next(false);
        },
        () => {
          this.isConnected.next(false);
        }
      );
    }


    sendData(data){
      this.bluetoothSerial.write(data).then(
        ()=>{
          console.log(data + 'sended');
        },
        ()=>{
          console.log('send data error');
        }
      );
    }

}
