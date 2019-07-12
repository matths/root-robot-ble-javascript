
window.LOG = 1;

var bleDevice = new BleDevice(Root.identifier, Root.services);

bleDevice.addEventListener('connected', function (event) {
  btnDisconnect.removeAttribute('disabled');
  btnScanAndConnect.setAttribute('disabled', 'disabled');

  var root = new Root(bleDevice);
  root.setup(function () {
    window.root = root;
  });
});

bleDevice.addEventListener('disconnected', function (event) {
  btnScanAndConnect.removeAttribute('disabled');
  btnDisconnect.setAttribute('disabled', 'disabled');
});

var btnScanAndConnect = document.getElementById('btnScanAndConnect')
var btnDisconnect = document.getElementById('btnDisconnect')

btnScanAndConnect.addEventListener('pointerup', scanAndConnect)
btnDisconnect.addEventListener('pointerup', disconnect)

function scanAndConnect (event) {
  bleDevice.scanAndConnect();
}

function disconnect (event) {
  bleDevice.disconnect();
}
