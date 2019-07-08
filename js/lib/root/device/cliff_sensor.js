function RootDeviceCliffSensor(root) {
  this.init(root);
}

Object.assign(RootDeviceCliffSensor.prototype, {
  init: function(root) {
    this.root = root;
    this.device = 20;

    this.root.listenForRobotEvent(this.device, 0, this.cliff.bind(this));
  },

  cliff: function (payload) {
    var timestamp = payload.getUint32(0);
    var cliff = payload.getUint8(4);
    var sensor = payload.getUint16(5);
    var threshold = payload.getUint16(7);
    this.dispatchEvent({
      type: 'cliff',
      cliff: cliff,
      sensor: sensor,
      threshold: threshold
    });
  }

});

Object.assign(RootDeviceCliffSensor.prototype, EventDispatcher.prototype);
