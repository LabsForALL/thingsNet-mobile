import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

declare var Peer : any;

export class ServerConnection{

  private connection: any;
  private username: any;
  private password: any;

  dataConnection: any;
  mediaConnection: any;

  constructor(name, pass, iceData) {

    this.username = name;
    this.password = pass;

    this.connection = new Peer(name, {
      key : 'mme0buekacrkvs4i',
      debug: 3,
      config: iceData
    });

  }


  observeServerConnection() : Observable<boolean> {
    return new Observable((observer) => {

      this.connection.on('open',
        () => {
          observer.next(true);
        }
      );

      this.connection.on('disconnected',
        () => {
          observer.next(false);
        }
      );

      this.connection.on('close',
        () => {
          observer.complete();
        }
      );

      this.connection.on('error',
        (err) => {
          let e = this.handleConnectionError(err);
          if(e.isFatal){
            observer.error(e.message);
          }
        }
      );

    });
  }


  observeDataConnection(): Observable<{}> {
    return new Observable((observer) => {

      this.connection.on('connection', (dataConnection) => {

        dataConnection.on('open',
          () =>{
            observer.next(dataConnection);
            this.dataConnection = dataConnection;
          }
        );


        dataConnection.on('close',
          () => {
            observer.complete();
          }
        );


        dataConnection.on('error',
          (err) => {
            observer.error(err);
          }
        );

        }
      );

    });

  }


  observeDataStream(): Observable<{}> {
    return new Observable((observer) => {

      if(!this.dataConnection){
        observer.error("no data connection");
      }

      this.dataConnection.on('data',
        (data) => {
          observer.next(data);
        }
      );

    });
  }






  private handleConnectionError (err) {

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



}
