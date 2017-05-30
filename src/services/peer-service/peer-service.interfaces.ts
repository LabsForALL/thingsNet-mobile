
export interface IPeerServiceListener{
  onPeerServiceOpen();
  onPeerServiceClosed(reason: String);
}


export interface IPeerDataConnectionListener{
  onPeerDataConnectionOpen();
  onPeerDataConnectionData(data:any);
  onPeerDataConnectionClose();
  onPeerDataConnectionError(err:any);
}


export interface IPeerMediaConnectionListener{
  onPeerMediaConnectionOpen(stream:any);
  onPeerMediaConnectionClosed();
  onPeerMediaConnectionError(err:any);
}

