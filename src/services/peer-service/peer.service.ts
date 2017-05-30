import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
declare var Peer : any;


@Injectable()
export class PeerService {

  private serverConnection: any;
  private dataConnection: any;
  private mediaConnection: any;
  private remoteMediaStream: any;


  username: String;
  password: String;

  // TURN and STUN servers
  iceData: any;

  // Connections states
  isServerConnected = new BehaviorSubject(false);
  isDataConnected = new BehaviorSubject(false);
  isMediaConnected = new BehaviorSubject(false);


  constructor(private http: Http) { }


  connect(name: String, pass: String) {

    this.username = name;
    this.password = pass;

    return new Promise((resolve, reject) => {

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
            // TURN servers data is ready so lets create the peer
            this.iceData = iceData;
            this.createLocalPeer(resolve, reject);
          },
          err => {
            reject(err);
          }
        );
    });
  }


  private createLocalPeer(resolve, reject){


    this.serverConnection = new Peer(this.username, {
      key : 'mme0buekacrkvs4i',
      debug: 3,
      config: this.iceData
    });


    this.serverConnection.on('open',
      (usrName) => {
        this.isServerConnected.next(true);
        resolve();
      }
    );


    this.serverConnection.on('disconnected',
      () => {
        this.isServerConnected.next(false);
      }
    );


    this.serverConnection.on('close',
      () => {
        this.isServerConnected.next(false);
      }
    );


    this.serverConnection.on('error',
      (err) => {
        let errInfo = this.handlePeerError(err);
        if(errInfo.isFatal) this.isServerConnected.next(false);
        reject(errInfo.message);
      }
    );

    this.listenForDataConnection();
    this.listenForMediaConnection();

  }


  listenForDataConnection() {

    this.serverConnection.on('connection',
      (dataConnection) => {

        this.dataConnection = dataConnection;

        dataConnection.on('open',
          () =>{
            this.isDataConnected.next(true);
          }
        );

        dataConnection.on('data',
          (data) => {
            console.log(data);
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

  }

  listenForMediaConnection() {

    this.serverConnection.on('call',
      (mediaConnection) => {

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

  }



  private handlePeerError (err) {

    let errorMessage : String = "";
    let isFatal: boolean = true;

    switch (err.type) {

      // The peer you're trying to connect to does not exist.
      case 'peer-unavailable':
        errorMessage = "Peer is unavailable";
        isFatal = false;
        break;

      // You've already disconnected this peer from
      // the server and can no longer make any new connections on it.
      case 'disconnected':
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

    return { isFatal: isFatal, message : errorMessage};
  }


  private destroyLocalPeer(){
    if(this.serverConnection){
      this.serverConnection.disconnect();
      this.serverConnection.destroy();
    }
  }


  terminate(){
    this.destroyLocalPeer();
  }

}
