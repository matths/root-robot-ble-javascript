function RootDeviceBattery(root) {
  this.init(root);
}

Object.assign(RootDeviceBattery.prototype, {
  init: function(root) {
    this.root = root;
    this.device = 14;

    this.root.listenForRobotEvent(this.device, 0, this.batteryLevel.bind(this));
  },

  getBatteryLevel: function (frequency, duration, callback) {
    var command = 1;
    this.root.toRobot(this.device, command, null, this.getBatteryLevelResponse(callback));
  },
  getBatteryLevelResponse: function (callback) {
    return function (payload) {
      var timestamp = payload.getUint32(0);
      var voltage = payload.getUint16(4);
      var percent = payload.getUint8(6);
      callback(timestamp, voltage, percent);
    };
  },

  batteryLevel: function (payload) {
    var timestamp = payload.getUint32(0);
    var voltage = payload.getUint16(4);
    var percent = payload.getUint8(6);
    this.dispatchEvent({
      type: 'light',
      timestamp: timestamp,
      voltage: voltage,
      percent: percent
    });
  }

});

Object.assign(RootDeviceBattery.prototype, EventDispatcher.prototype);
