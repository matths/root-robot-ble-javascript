function Root(bleDevice) {
  this.init(bleDevice);
}

Object.assign(Root.prototype, {
  init: function(bleDevice) {
    this.utf8TextEncoder = new TextEncoder('utf-8');
    this.utf8TextDecoder = new TextDecoder('utf-8');
    this.bleDevice = bleDevice;
    this.pending = {};
    this.inc = 0;
    this.rx = null;
    this.tx = null;

    this.device = {};
    this.device.general = new RootDeviceGeneral(this);
    this.device.motors = new RootDeviceMotors(this);
    this.device.markerEraser = new RootDeviceMarkerEraser(this);
    this.device.ledLights = new RootDeviceLedLights(this);
    this.device.colorSensor = new RootDeviceLedColorSensor(this);
    this.device.sound = new RootDeviceSound(this);
    this.device.bumpers = new RootDeviceBumpers(this);
    this.device.lightSensors = new RootDeviceLightSensors(this);
    this.device.battery = new RootDeviceBattery(this);
    this.device.touchSensors = new RootDeviceTouchSensors(this);
    this.device.cliffSensor = new RootDeviceCliffSensor(this);
  },
  log: function () {
    if (window.LOG) {
      console.log.apply(console, arguments);
    }
  },
  setup: function (doneCallback) {
    var self = this;
    this.bleDevice.getCharacteristicByServiceUuidAndCharacteristicUuid(
      bleProfile['root'].service['UART'].UUID,
      bleProfile['root'].service['UART'].characteristic['TX'].UUID,
      function (characteristic) {
        self.tx = characteristic;

        self.bleDevice.getCharacteristicByServiceUuidAndCharacteristicUuid(
          bleProfile['root'].service['UART'].UUID,
          bleProfile['root'].service['UART'].characteristic['RX'].UUID,
          function (characteristic) {
            self.rx = characteristic;

            self.bleDevice.listenForNotificationValueFromCharacteristic(self.rx, self.rxHandler.bind(self));

            doneCallback();
          });
      });
  },
  crcCheck: function (dataView) {
    var checksumFromDataView = dataView.getUint8(19);
    var checksum = crc8(new Uint8Array(dataView.buffer.slice(0,19)), true);
    return (checksum == checksumFromDataView);
  },
  getInc: function () {
    if (this.inc > 255) {
      this.inc = 0;
    }
    return this.inc++;
  },
  rxHandler: function (event) {
    this.fromRobot(event.target.value); // DataView
  },
  timeoutRobot: function (key) {
      if (this.pending[key]) {
        clearTimeout(this.pending[key].timeout);
        delete this.pending[key];
      }
  },
  fromRobot: function (dataView) {
    this.log('RECEIVED', new Uint8Array(dataView.buffer));
    if (this.crcCheck(dataView)) {
      var key = dataView.getUint16(0);
      // var device = dataView.getUint8(0);
      // var command = dataView.getUint8(1);
      var id = dataView.getUint8(2); // either req or evt
      var payload = new DataView(dataView.buffer.slice(3,19));

      // if (this.pending[key] && this.pending[key].id == id) {
      if (this.pending[key]) {
        responseCallback = this.pending[key].responseCallback;
        if (this.pending[key].timeout) {
          clearTimeout(this.pending[key].timeout);
          delete this.pending[key];          
        }
        responseCallback(payload);
      }
    }
  },
  toRobot: function (device, command, payload, responseCallback, timeout) {
    var self = this;
    var message = new Uint8Array(20);
    var id = this.getInc();
    message.set([device, command, id], 0);
    if (payload!=null) {
      message.set(payload, 3);
    }
    var checksum = crc8(message.slice(0,19), true);
    message.set([checksum], 19);

    var dataView = new DataView(message.buffer);
    if (responseCallback) {
      var key = dataView.getUint16(0);
      this.pending[key] = {
        id: id,
        responseCallback: responseCallback,
        timeout: !timeout?null:setTimeout(function () {
          self.timeoutRobot(key);
        }, (timeout?timeout:500)),
      };
    }

    this.log('SENT', new Uint8Array(dataView.buffer));
    this.tx.writeValue(message.buffer);
  },
  listenForRobotEvent: function (device, command, responseCallback) {
    var self = this;
    var message = new Uint8Array(2);
    message.set([device, command], 0);
    var dataView = new DataView(message.buffer);
    var key = dataView.getUint16(0);
    this.pending[key] = {
      responseCallback: responseCallback,
    }
  },
  decodeUtf8Text: function (arr) {
    return this.utf8TextDecoder.decode(arr);
  },
  encodeUtf8Text: function (str) {
    return this.utf8TextEncoder.encode(str);
  },
  getUint4Array: function (dataView) {
    var retArr = [];
    var arr = new Uint8Array(dataView.buffer);
    arr.forEach(function (uint8) {
      var uint4left = (uint8 >> 4);
      var uint4right = (uint8 & 0x0f);
      retArr.push(uint4left);
      retArr.push(uint4right);
    })
    return retArr;
  }
});

Object.assign(Root.prototype, EventDispatcher.prototype);

Root.identifier = bleProfile['root'].service['RootIdentifier'].UUID;
Root.services = [
  bleProfile['root'].service['DeviceInformation'].UUID,
  bleProfile['root'].service['UART'].UUID
];
