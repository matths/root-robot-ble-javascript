function RootDeviceBumpers(root) {
  this.init(root);
}

Object.assign(RootDeviceBumpers.prototype, {
  init: function(root) {
    this.root = root;
    this.device = 12;

    this.NO_BUMPERS_PRESSED = 0; // 0x00
    this.RIGHT_BUMPER_PRESSED = 64; // 0x40
    this.LEFT_BUMPER_PRESSED = 128; // 0x80
    this.BOTH_BUMPERS_PRESSED = 192; // 0xC0

    this.root.listenForRobotEvent(this.device, 0, this.bumper.bind(this));
  },

  bumper: function (payload) {
    var timestamp = payload.getUint32(0);
    var state = payload.getUint8(4);
    this.dispatchEvent({
      type: 'bumper',
      state: state
    });
  }

});

Object.assign(RootDeviceBumpers.prototype, EventDispatcher.prototype);
