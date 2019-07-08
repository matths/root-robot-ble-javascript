function RootDeviceMotors(root) {
  this.init(root);
}

Object.assign(RootDeviceMotors.prototype, {
  init: function(root) {
    this.root = root;
    this.device = 1;

    this.STALL_MOTOR_LEFT = 0;
    this.STALL_MOTOR_RIGHT = 1;
    this.STALL_MOTOR_MARKER_ERASER = 2;

    this.STALL_CAUSE_NO_STALL = 0;
    this.STALL_CAUSE_OVERCURRENT = 1;
    this.STALL_CAUSE_UNDERCURRENT = 2;
    this.STALL_CAUSE_UNDERSPEED = 3;
    this.STALL_CAUSE_SATURATED_PID = 4;
    this.STALL_CAUSE_TIMEOUT = 5;

    this.BOARD_COLOR = 0xC6;

    this.root.listenForRobotEvent(this.device, 29, this.motorStall.bind(this));
  },

  // leftSpeed (int32_t) 4 Bytes, Left motor speed in units of mm/s.
  // Positive values are forwards, negative values are backwards.
  // Minimum value of -100 0xFFFFFF9C. Maximum value of 100 0x00000064.
  //
  // rightSpeed (int32_t) 4 Bytes, Right motor speed in units of mm/s.
  // Positive values are forwards, negative values are backwards.
  // Minimum value of -100 0xFFFFFF9C. Maximum value of 100 0x00000064.
  setLeftAndRightMotorSpeed: function (leftSpeed, rightSpeed) {
    var command = 4;
    var dataView = new DataView((new Uint8Array(8)).buffer);
    dataView.setInt32(0, leftSpeed, false);
    dataView.setInt32(4, rightSpeed, false);
    var payload = new Uint8Array(dataView.buffer);
    this.root.toRobot(this.device, command, payload);
  },

  setLeftMotorSpeed: function (leftSpeed) {
    var command = 6;
    var dataView = new DataView((new Uint8Array(4)).buffer);
    dataView.setInt32(0, leftSpeed, false);
    var payload = new Uint8Array(dataView.buffer);
    this.root.toRobot(this.device, command, payload);
  },

  setRightMotorSpeed: function (rightSpeed) {
    var command = 7;
    var dataView = new DataView((new Uint8Array(4)).buffer);
    dataView.setInt32(0, rightSpeed, false);
    var payload = new Uint8Array(dataView.buffer);
    this.root.toRobot(this.device, command, payload);
  },

  driveDistance: function (distance, callback) {
    var command = 8;
    var dataView = new DataView((new Uint8Array(4)).buffer);
    dataView.setInt32(0, distance, false);
    var payload = new Uint8Array(dataView.buffer);
    this.root.toRobot(this.device, command, payload, this.driveDistanceFinishedResponse(callback), null); // no timeout
  },
  driveDistanceFinishedResponse: function (callback) {
    return callback;
  },

  rotateAngel: function (angle, callback) {
    var command = 12;
    var dataView = new DataView((new Uint8Array(4)).buffer);
    dataView.setInt32(0, angle, false);
    var payload = new Uint8Array(dataView.buffer);
    this.root.toRobot(this.device, command, payload, this.rotateAngelFinishedResponse(callback), null); // no timeout
  },
  rotateAngelFinishedResponse: function (callback) {
    return callback;
  },

  motorStall: function (payload) {
    var timestamp = payload.getUint32(0);
    var motor = payload.getUint8(4);
    var cause = payload.getUint8(5);
    this.dispatchEvent({
      type: 'motorStall',
      motor: motor,
      cause: cause
    });
  }

});

Object.assign(RootDeviceMotors.prototype, EventDispatcher.prototype);
