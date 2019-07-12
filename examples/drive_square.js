
function runQueue(arr) {
  var fnc = arr.shift();
  var next = function () { runQueue(arr); };
  if (arr.length<=0) {
    next = function () { console.log('done'); }
  }
  fnc(next);
}

var go15cm = function (next) {
  root.device.motors.driveDistance(150, next);
}
var turn90deg = function (next) {
  root.device.motors.rotateAngel(900, next);
}

runQueue([go15cm, turn90deg, go15cm, turn90deg, go15cm, turn90deg, go15cm, turn90deg]);
