function RootDeviceLightSensors(root) {
  this.init(root);
}

Object.assign(RootDeviceLightSensors.prototype, {
  init: function(root) {
    this.root = root;
    this.device = 13;

    this.AMBIENT_LIGHT_BOTH_EYES_DARK = 4;
    this.AMBIENT_LIGHT_RIGHT_EYE_BRIGHTER_THAN_LEFT_EYE = 5;
    this.AMBIENT_LIGHT_LEFT_EYE_BRIGHTER_THAN_RIGHT_EYE = 6;
    this.AMBIENT_LIGHT_BOTH_EYES_BRIGHT = 7;

    this.root.listenForRobotEvent(this.device, 0, this.light.bind(this));
  },

  light: function (payload) {
    var timestamp = payload.getUint32(0);
    var state = payload.getUint8(4);
    var left = payload.getUint16(5);
    var right = payload.getUint16(7);
    this.dispatchEvent({
      type: 'light',
      state: state,
      left:left,
      right: right
    });
  }

});

Object.assign(RootDeviceLightSensors.prototype, EventDispatcher.prototype);
