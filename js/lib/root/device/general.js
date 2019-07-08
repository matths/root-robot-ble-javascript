function RootDeviceGeneral(root) {
	this.init(root);
}

Object.assign(RootDeviceGeneral.prototype, {
	init: function(root) {
		this.root = root;
		this.device = 0;
		this.BOARD_MAIN = 0xA5;
		this.BOARD_COLOR = 0xC6;

    this.root.listenForRobotEvent(this.device, 4, this.stopProject.bind(this));
	},

	// board uint8_t
	getVersions: function (board, callback) {
		var command = 0;
		this.root.toRobot(this.device, command, [board], this.getVersionsResponse(callback));
	},
	getVersionsResponse: function (callback) {
		return function (payload) {
			var board = payload.getUint8(0);
			var response = "Board: " + (board==0xA5?'Main board':(board==0xC6?'Color board':'N/A'));
			response += "\nFirmware version: " + payload.getUint8(1) + "." + payload.getUint8(2);
			response += "\nHardware version: " + payload.getUint8(3) + "." + payload.getUint8(4);
			response += "\nBootloader version: " + payload.getUint8(5) + "." + payload.getUint8(6);
			response += "\nProtocol version: " + payload.getUint8(7) + "." + payload.getUint8(8);
			callback(response);
		};
	},

	setName: function (name) {
		var command = 1;
		var payload = this.root.encodeUtf8Text(name);
		this.root.toRobot(this.device, command, payload);
	},

	getName: function (callback) {
		var command = 2;
		this.root.toRobot(this.device, command, null, this.getNameResponse(callback));
	},
	getNameResponse: function (callback) {
		return function (payload) {
			callback(this.root.decodeUtf8Text(payload));
		};
	},

	stopAndReset: function () {
		var command = 3;
		this.root.toRobot(this.device, command);
	},

  stopProject: function (payload) {
    this.dispatchEvent({
      type: 'stopProject'
    });
  },

	disconnect: function () {
		var command = 6;
		this.root.toRobot(this.device, command, null);
	},

	// devicesBitfield uint128_t
	enableEvents: function (devicesBitfield) {
		var command = 7;
		this.root.toRobot(this.device, command, null);
	},

	// devicesBitfield uint128_t
	disableEvents: function (devicesBitfield) {
		var command = 9;
    this.root.toRobot(this.device, command, devicesBitfield);
	},

	getEnabledEvents: function (callback) {
		var command = 11;
    this.root.toRobot(this.device, command, null, this.getEnabledEventsResponse(callback));
	},
  getEnabledEventsResponse: function (callback) {
    return function (payload) {
      var devicesBitfield = payload;
      callback(devicesBitfield);
    };
  },

	getSerialNumber: function (callback) {
		var command = 14;
    this.root.toRobot(this.device, command, null, this.getSerialNumberResponse(callback));
	},
  getSerialNumberResponse: function (callback) {
    return function (payload) {
      var serialNumber = this.root.decodeUtf8Text(payload.buffer.slice(0,12));
      callback(serialNumber);
    };
  }
});

Object.assign(RootDeviceGeneral.prototype, EventDispatcher.prototype);
