function RootDeviceLedColorSensor(root) {
  this.init(root);
}

Object.assign(RootDeviceLedColorSensor.prototype, {
  init: function(root) {
    this.root = root;
    this.device = 4;

    this.BANK_0_7 = 0;
    this.BANK_8_15 = 1;
    this.BANK_16_23 = 2;
    this.BANK_24_31 = 3;

    this.LIGHTING_OFF = 0;
    this.LIGHTING_RED = 1;
    this.LIGHTING_GREEN = 2;
    this.LIGHTING_BLUE = 3;
    this.LIGHTING_ALL = 4;

    this.FORMAT_12_BIT_ADC_COUNTS = 0;
    this.FORMAT_MILLIVOLTS = 1;

		this.COLOR_WHITE = 0;
		this.COLOR_BLACK = 1;
		this.COLOR_RED = 2;
		this.COLOR_GREEN = 3;
		this.COLOR_BLUE = 4;

    this.root.listenForRobotEvent(this.device, 2, this.colorSensorEvent.bind(this));
  },

  getColorSensorData: function (bank, lighting, format, callback) {
    var command = 1;
    var payload = new Uint8Array([bank, lighting, format]);
    this.root.toRobot(this.device, command, payload, this.colorSensorDataResponse(callback));
  },
  colorSensorDataResponse: function (callback) {
    return function (payload) {
    	var sensorValues = new Uint16Array(payload.buffer);
      callback(sensorValues);
    };
  },

  colorSensorEvent: function (payload) {
  	var uint4arr = this.root.getUint4Array(payload);
    this.dispatchEvent({
      type: 'colorSensor',
      colorValues: uint4arr
    });
  }

});

Object.assign(RootDeviceLedColorSensor.prototype, EventDispatcher.prototype);
