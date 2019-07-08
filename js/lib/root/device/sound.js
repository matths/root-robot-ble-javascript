function RootDeviceSound(root) {
  this.init(root);
}

Object.assign(RootDeviceSound.prototype, {
  init: function(root) {
    this.root = root;
    this.device = 5;

    this.FREQUENCY_NOTE_C = 261.63;
    this.FREQUENCY_NOTE_D = 293.66;
    this.FREQUENCY_NOTE_E = 329.62;
    this.FREQUENCY_NOTE_F = 349.23;
    this.FREQUENCY_NOTE_G = 392.00;
    this.FREQUENCY_NOTE_A = 440.00;
    this.FREQUENCY_NOTE_H = 466.16;
    this.FREQUENCY_NOTE_C = 493.88;

    this.DURATION_FULL = 2;
    this.DURATION_HALF = 1;
    this.DURATION_QUARTER = 0.5;
    this.DURATION_EIGHTH = 0.25;
    this.DURATION_SIXTEENTHS = 0.125;
  },

  playNote: function (frequency, duration, callback) {
    var command = 0;
	var dataView = new DataView((new Uint8Array(6)).buffer);
    dataView.setUint32(0, frequency);
    dataView.setUint16(4, duration);
    var payload = new Uint8Array(dataView.buffer);
    this.root.toRobot(this.device, command, payload, this.playNoteFinishedResponse(callback));
  },
  playNoteFinishedResponse: function (callback) {
    return callback;
  },

  stopNote: function () {
    var command = 1;
    this.root.toRobot(this.device, command);
  },

  sayPhrase: function (phrase, callback) {
	var command = 4;
	var payload = this.root.encodeUtf8Text(phrase);
    this.root.toRobot(this.device, command, payload, this.sayPhraseFinishedResponse(callback));
  },
  sayPhraseFinishedResponse: function (callback) {
    return callback;
  }

});

Object.assign(RootDeviceSound.prototype, EventDispatcher.prototype);
