#!/bin/bash

npm install uglify-js -g

uglifyjs js/lib/crc8.js \
         js/lib/event_dispatcher.js \
         js/lib/ble_device.js \
         js/lib/root/device/general.js \
         js/lib/root/device/motors.js \
         js/lib/root/device/marker_eraser.js \
         js/lib/root/device/led_lights.js \
         js/lib/root/device/color_sensor.js \
         js/lib/root/device/sound.js \
         js/lib/root/device/bumpers.js \
         js/lib/root/device/light_sensors.js \
         js/lib/root/device/battery.js \
         js/lib/root/device/touch_sensors.js \
         js/lib/root/device/cliff_sensor.js \
         js/lib/root/ble_profile.js \
         js/lib/root/root.js \
         -o js/root.min.js -c -m \
         --source-map
