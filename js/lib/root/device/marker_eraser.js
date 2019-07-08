function RootDeviceMarkerEraser(root) {
  this.init(root);
}

Object.assign(RootDeviceMarkerEraser.prototype, {
  init: function(root) {
    this.root = root;
    this.device = 2;

    this.MARKER_UP_ERASER_UP = 0;
    this.MARKER_DOWN_ERASER_UP = 1;
    this.MARKER_UP_ERASER_DOWN = 2;
  },

  setMarkerEraserPosition: function (position, callback) {
    var command = 0;
    var payload = new Uint8Array([position]);
    this.root.toRobot(this.device, command, payload, this.setMarkerEraserPositionFinishedResponse(callback), 3000);
  },
  setMarkerEraserPositionFinishedResponse: function (callback) {
    return function (payload) {
      var position = payload.getUint8(0);
      callback(position);
    };
  }

});

Object.assign(RootDeviceMarkerEraser.prototype, EventDispatcher.prototype);
