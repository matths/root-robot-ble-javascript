# Root Robot Bluetooth Low Energy Protocol Implementation in Javascript

This is a basic Javascript implementation of the Root Robot Bluetooth Low Energy (BLE) protocol documentation.

The protocol was shared by [Root Robotics](https://github.com/RootRobotics), the creators of the Root robot.

## Setup

You can just inclide the minified Javascript file and then you're ready to so.

```html
<script type="text/javascript" src="js/root.min.js"></script>
```
## Init root Object

Works in all browsers supporting `navigator.bluetooth.requestDevice` (e.g. Chrome).<br>
This is the minimum code to access the Javascript protocol implementation.<br>
You need to trigger the Bluetooth Low energy device coupling by a user event.<br>
That's a limitation of the browsers access to BLE devices.<br>

As a result of this code snippet, you'll have a root Object,<br>
which offers all documented protocol functions as of version 1.1

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

## API

See our [API documentation](API.md), what methods, evemts and properties are offered by this [Root Robot protocol](https://github.com/RootRobotics/root-robot-ble-protocol) implementation.

## Examples

Some very basic examples, how to use the protocol implementation (API).

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

