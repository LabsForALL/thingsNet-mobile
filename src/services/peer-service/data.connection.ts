import {BehaviorSubject} from "rxjs/BehaviorSubject";
export class DataConnection {

  remotePeer: any;
  metadata: any;
  dataChannel: any;
  label: any;
  isOpen: boolean;
  peerConnection: any;
  isReliable: any;
  serialization: any;
  type: any;
  bufferSize: any;
  dataStream: BehaviorSubject<{}>;

  constructor( private dataConnection : any ) {

    this.dataChannel = this.dataConnection.dataChannel;
    this.label = this.dataConnection.label;
    this.metadata = dataConnection.metadata;
    this.isOpen = dataConnection.open;
    this.peerConnection = dataConnection.peerConnection;
    this.remotePeer = dataConnection.peer;
    this.isReliable = dataConnection.reliable;
    this.serialization = dataConnection.serialization;
    this.type = dataConnection.type;
    this.bufferSize = dataConnection.bufferSize;

    dataConnection.on('open',
      () =>{
        this.dataStream.next({});
      }
    );

    //Creating data stream
    this.dataStream = new BehaviorSubject({});
    dataConnection.on('data',
      (data) => {
        this.dataStream.next(data);
      }
    );


    dataConnection.on('close',
      () => {
        this.dataStream.complete();
      }
    );


    dataConnection.on('error',
      (err) => {
        this.dataStream.error(err);
      }
    );

  }



  send(data: any) {
    this.dataConnection.send(data);
  }


  close() {
    this.dataConnection.close();
  }



}
