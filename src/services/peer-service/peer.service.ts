import { Injectable } from '@angular/core';
import {Network} from "@ionic-native/network";
import {ServerConnection} from "./server.connection";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class PeerService {

  isConnected: BehaviorSubject<boolean>;
  serverConnection: ServerConnection;


  constructor(private network: Network,
              private http: Http) {
    this.isConnected = new BehaviorSubject(false);
  }


  private getXirSysData(): Promise <any>{
    return new Promise((resolve, reject) =>{

      // getting the TURN servers data from xirsys
      let headers = new Headers({ 'Content-Type': 'application/json'});
      let body = JSON.stringify({
        ident: "oneforall",
        secret: "f447dbec-1985-11e7-aa4e-23dc7b36f79d",
        domain: "www.webrobot.com",
        application: "default",
        room: "default"
      });

      this.http.post("https://service.xirsys.com/ice", body, headers)
        .map(res => res.json())
        .toPromise()
        .then(
          (iceData) => {
            resolve(iceData);
          },
          err => {
            reject(err);
          }
        );

    });

  }


  connect(name: String, pass: String): Promise<any> {
    return new Promise((resolve, reject) => {

      if (this.network.type == "none") {
        reject("'Please connect to internet first'");
        return;
      }

      this.getXirSysData().then(
        data => {

          this.serverConnection = new ServerConnection(name,pass,data);
          this.serverConnection.observeServerConnection().subscribe(
            isConnected => {
              this.isConnected.next(isConnected);
              if(isConnected){
                // conn open
                resolve();
              }
            },
            err => {
              reject(err);
              this.isConnected.error(err);
            },
            () => {
              // conn closed
              this.isConnected.complete();
            }
          )

        },
        err => {
          reject(err);
        }
      );

    })

  }

  

















  listenForPeerConnections() {
  /*
    // Listen for data connection
    this.serverConnection.on('connection',
      (dataConnection) => {

        this.pConnections.value.push(dataConnection);

        dataConnection.on('open',
          () =>{
            // Able to send data !!


            this.isDataConnected.next(true);
          }
        );


        dataConnection.on('data',
          (data) => {
            this.dataStream.next(data);
          }
        );


        dataConnection.on('close',
          () => {
            this.isDataConnected.next(false);
          }
        );


        dataConnection.on('error',
          (err) => {
            this.isDataConnected.next(false);
          }
        );

      }
    );





    // Listen for media connection
    this.serverConnection.on('call', (mediaConnection) => {

        this.mediaConnection = mediaConnection;

        navigator.getUserMedia(
          {video: true, audio: true},
          (localStream) => {
            mediaConnection.answer(localStream);
          },
          (err) => {
            console.log('Failed to get local stream', err);
          }
        );


        mediaConnection.on('stream',
          (stream) =>{
            this.isMediaConnected.next(true);
            this.remoteMediaStream = stream;
          }
        );


        mediaConnection.on('close',
          () => {
            this.isMediaConnected.next(false);
          }
        );


        mediaConnection.on('error',
          (err) => {
            console.log(err);
            this.isMediaConnected.next(false);
          }
        );
      }
    );
*/
  }




  createPeerConnection(pName) {

    /*
    let dataConnection = this.serverConnection.connect(pName, {
      label : "remoteConnection",
      metadata : "password",
    });

    navigator.getUserMedia(
      {video: true, audio: true},
      (localStream) => {
        let mediaConnection = this.serverConnection.call(pName, localStream, {
          metadata:"asdko"

        });
      },
      (err) => {
        console.log('Failed to get local stream', err);
      }
    );
  */
  }




  private destroyLocalPeer(){

  }


  terminate(){
    this.destroyLocalPeer();
  }

}
