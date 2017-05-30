export interface IBluetoothServiceListener{
    onBluetoothModuleOn?();
    onBluetoothModuleOff?();
    onPairedDevicesFound?(devices);
    onPairedDevicesError?();
    onSearchFound?(devices);
    onSearchFinished?(devices);
    onSearchError?();
    onConnectionSuccess?();
    onConnectionError?();
    onConnectionClosed?();
    onCommandSend?();
    onCommandSendError?();
}
