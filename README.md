# Root Robot Bluetooth Low Energy Protocol Implementation in Javascript

This is a basic Javascript implementation of the Root Robot Bluetooth Low Energy (BLE) protocol documentation.

The protocol was shared by [Root Robotics](https://github.com/RootRobotics), the creators of the Root robot.


## Minimum code to access root protocol methods

```javascript
var bleDevice = new BleDevice(Root.identifier, Root.services);
bleDevice.addEventListener('connected', function(e) {
  var root = new Root(bleDevice);
  root.setup(function (root) {
    root.device.sound.sayPhrase('Hello world!', console.log);
    console.log('start using root', root);
    window.root = root;
  });
});

// ble device coupling needs a user event to be triggered
document.addEventListener('pointerup', function() {
  bleDevice.scanAndConnect();
});
```
## Some basic examples

### A simple queue for robot commands

```javascript
function runQueue(arr) {
  var fnc = arr.shift();
  var next = function () { runQueue(arr); };
  if (arr.length<=0) {
    next = function () { console.log('done'); }
  }
  fnc(next);
}
```

### Motor usage

Drive along a 15 centimeters square rectangle.

```javascript
var go15cm = function (next) {
  root.device.motors.driveDistance(150, next);
}

var turn90deg = function (next) {
  root.device.motors.rotateAngel(900, next);
}

runQueue([go15cm, turn90deg, go15cm, turn90deg, go15cm, turn90deg, go15cm, turn90deg]);
```

### Sound

Play notes of a scale.

```javascript
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
```

### Sound and touch usage

Play different sounds, when touching the four quadrant touch areas on top of root.

```javascript
root.device.touchSensors.addEventListener('touch', function (e) {
  if (e.frontLeft) { playNote('A4')(); }
  if (e.frontRight) { playNote('B4')(); }
  if (e.rearLeft) { playNote('D4')(); }
  if (e.rearRight) { playNote('E4')(); }
});
```

### Enable Logging

```javascript
window.LOG = 1; // enable logging
```

## API

more to come…
