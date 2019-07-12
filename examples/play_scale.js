
function runQueue(arr) {
  var fnc = arr.shift();
  var next = function () { runQueue(arr); };
  if (arr.length<=0) {
    next = function () { console.log('done'); }
  }
  fnc(next);
}

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

runQueue([playNote('C4'), playNote('D4'), playNote('E4'), playNote('F4'), playNote('G4'), playNote('A4'), playNote('B4'), playNote('C5')]);
