import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {
  IPeerServiceListener, IPeerDataConnectionListener, IPeerMediaConnectionListener,
  IPeerServiceListeners
} from './peer-service.interfaces'
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {BluetoothService} from "../bluetooth-service/bluetooth.service";
declare var Peer : any;


@Injectable()
export class PeerService {

  private localPeer: any;
  private serviceListener: IPeerServiceListener = undefined;
  private dataConnectionListener: IPeerDataConnectionListener = undefined;
  private mediaConnectionListener: IPeerMediaConnectionListener = undefined;

  constructor(private http: Http,
              private btService: BluetoothService) {
  }

  setServiceListener(listener:IPeerServiceListener){
    this.serviceListener = listener;
  }


  removeServiceListener(){
    this.serviceListener = undefined;
  }


  setDataConnectionListener(listener:IPeerDataConnectionListener){
    this.dataConnectionListener = listener;
  }


  removeDataConnectionListener(){
    this.dataConnectionListener = undefined;
  }


  setMediaConnectionListener(listener:IPeerMediaConnectionListener){
    this.mediaConnectionListener = listener;
  }


  removeMediaConnectionListener(){
    this.mediaConnectionListener = undefined;
  }


  setListener(listener:IPeerServiceListeners){
    this.setServiceListener(listener);
    this.setDataConnectionListener(listener);
    this.setMediaConnectionListener(listener);
  }


  removeAllListeners(){
    this.removeServiceListener();
    this.removeDataConnectionListener();
    this.removeMediaConnectionListener();
  }


  tryToConnect(usrName, password){

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
        (data) => {
          // TURN servers data is ready so lets create the peer
          this.createLocalPeer(usrName,data.d);
        },
        err => {
          console.log(err);
          this.serviceListener.onPeerServiceError("XirSys connection failed", true);
        }
      )

  }


  private createLocalPeer(name,data){

    this.localPeer = new Peer(name, {
      key : 'mme0buekacrkvs4i',
      debug: 3,
      config: data
    });

    this.localPeer.on('open',
      (usr) => {
        if(this.serviceListener)
          this.serviceListener.onPeerServiceOpen(usr);
      }
    );


    this.localPeer.on('connection',
      (dataConnection) => {

        dataConnection.on('open',
          () =>{
            if(this.dataConnectionListener)
              this.dataConnectionListener.onPeerDataConnectionOpen();
          }
        );


        dataConnection.on('data',
          (data) => {

            // Check if the data is command and send to bluetooth
            if(data.type == 'COMMAND'){
              this.btService.sendData(data.command);
            }

          }
        );

        dataConnection.on('close',
          () => {
            if(this.dataConnectionListener)
              this.dataConnectionListener.onPeerDataConnectionClose();
          }
        );

        dataConnection.on('error',
          (err) => {
            if(this.dataConnectionListener)
              this.dataConnectionListener.onPeerDataConnectionError(err);
          }
        );

      }
    );


    this.localPeer.on('call',
      (mediaConnection) => {

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
            if(this.mediaConnectionListener)
              this.mediaConnectionListener.onPeerMediaConnectionOpen(stream);
          }
        );

        mediaConnection.on('close',
          () => {
            if(this.mediaConnectionListener)
              this.mediaConnectionListener.onPeerMediaConnectionClosed();
          }
        );

        mediaConnection.on('error',
          (err) => {
            if(this.dataConnectionListener)
              this.mediaConnectionListener.onPeerMediaConnectionError(err);
          }
        );
      }
    );



    this.localPeer.on('disconnected',
      () => {
        if(this.serviceListener)
          this.serviceListener.onPeerServiceDisconnected();
      }
    );



    this.localPeer.on('close',
      () => {
        if(this.serviceListener)
          this.serviceListener.onPeerServiceClosed();
      }
    );



    this.localPeer.on('error',
      (err) => {

        let errorMessage : String = "";
        let isFatal: boolean = true;

        switch (err.type) {

          case 'peer-unavailable':
            errorMessage = "Peer is unavailable";
            isFatal = false;
            break;

          case 'disconnected':
            isFatal = false;
            errorMessage = "Disconnected from the server";
            break;

          case 'browser-incompatible':
            errorMessage = "Please use browser with WebRTC support.";
            break;

          case 'invalid-id':
            errorMessage = "Invalid ID, try new one";
            break;

          case 'invalid-key':
            errorMessage = "Invalid key, get another one";
            break;

          case 'network':
            errorMessage = "Network problem occurred, check your connection";
            break;

          case 'ssl-unavailable':
            errorMessage = "SSL is unavailable";
            break;

          case 'server-error':
            errorMessage = "Server error occurred";
            break;

          case 'socket-error':
            errorMessage = "Socket error occurred";
            break;

          case 'socket-closed':
            errorMessage = "Socket was closed";
            break;

          case 'unavailable-id':
            errorMessage = "This id was taken";
            break;

          case 'webrtc':
            errorMessage = "RTC internal error occurred";
            break;
        }

        if(this.serviceListener)
          this.serviceListener.onPeerServiceError(errorMessage,isFatal);
      }
    );
  }


  private destroyLocalPeer(){
    if(this.localPeer){
      this.localPeer.disconnect();
      this.localPeer.destroy();
    }
  }

  terminate(){
    this.destroyLocalPeer();
  }


  getUsername() {
    if(this.localPeer){
      return this.localPeer.id;
    }

  }

}
