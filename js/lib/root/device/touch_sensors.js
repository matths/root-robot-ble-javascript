function RootDeviceTouchSensors(root) {
  this.init(root);
}

Object.assign(RootDeviceTouchSensors.prototype, {
  init: function(root) {
    this.root = root;
    this.device = 17;

    this.TOUCH_FRONT_LEFT = 0x80; // FL 1000 0000 128
    this.TOUCH_FRONT_RIGHT = 0x40; // FR 0100 0000 64
    this.TOUCH_REAR_RIGHT = 0x20; // RR 0010 0000 32
    this.TOUCH_REAR_LEFT = 0x10; // RL 0001 0000 16

    this.root.listenForRobotEvent(this.device, 0, this.touch.bind(this));
  },

  touch: function (payload) {
    var timestamp = payload.getUint32(0);
    var state = payload.getUint8(4);
    this.dispatchEvent({
      type: 'touch',
      frontLeft: !!(state & this.TOUCH_FRONT_LEFT),
      frontRight: !!(state & this.TOUCH_FRONT_RIGHT),
      rearRight: !!(state & this.TOUCH_REAR_RIGHT),
      rearLeft: !!(state & this.TOUCH_REAR_LEFT),
      state: state
    });
  }

});

Object.assign(RootDeviceTouchSensors.prototype, EventDispatcher.prototype);
