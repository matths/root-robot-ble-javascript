
var notes = {
  'C4': 261,
  'D4': 293,
  'E4': 329,
  'F4': 349,
  'G4': 392,
  'A4': 440,
  'B4': 493,
  'C5': 523
}

var playNote = function (note) {
  return function (next) {
    root.device.sound.playNote(notes[note], 400, next);
  }
}

root.device.touchSensors.addEventListener('touch', function (e) {
  if (e.frontLeft) { playNote('A4')(); }
  if (e.frontRight) { playNote('B4')(); }
  if (e.rearLeft) { playNote('D4')(); }
  if (e.rearRight) { playNote('E4')(); }
});
