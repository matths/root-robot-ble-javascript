function RootDeviceLedLights(root) {
  this.init(root);
}

Object.assign(RootDeviceLedLights.prototype, {
  init: function(root) {
    this.root = root;
    this.device = 3;

    this.LED_STATE_OFF = 0;
    this.LED_STATE_ON = 1;
    this.LED_STATE_BLINK = 2;
    this.LED_STATE_SPIN = 3;
  },

  setLedAnimation: function (state, red, green, blue) {
    var command = 0;
    var payload = new Uint8Array([state, red, gree, blue]);
    this.root.toRobot(this.device, command, payload);
  }

});

Object.assign(RootDeviceLedLights.prototype, EventDispatcher.prototype);
