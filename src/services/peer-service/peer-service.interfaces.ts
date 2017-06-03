/**
 * Created by eddy on 4/15/17.
 */
export interface IPeerServiceListener{
  onPeerServiceOpen(regName : String);
  onPeerServiceDisconnected();
  onPeerServiceClosed();
  onPeerServiceError(errMsg:String, isFatal:boolean);
}

export interface IPeerDataConnectionListener{
  onPeerDataConnectionOpen();
  onPeerDataConnectionClose();
  onPeerDataConnectionError(err:any);
}

export interface IPeerMediaConnectionListener{
  onPeerMediaConnectionOpen(stream:any);
  onPeerMediaConnectionClosed();
  onPeerMediaConnectionError(err:any);
}

export interface IPeerServiceListeners extends IPeerServiceListener,
  IPeerDataConnectionListener,
  IPeerMediaConnectionListener {

}
