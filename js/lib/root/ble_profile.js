// Root Robot Bluetooth Low Energy Protocol Documentation
// https://github.com/RootRobotics/root-robot-ble-protocol#ble-profile
// version 1.10

var bleProfile = {
  'root': {
    service: {
      'RootIdentifier': {
        // service is used to identify Root Robots and can be used by BLE
        // hosts that implement scan for devices with service methods.
        // The other services are present on other BLE devices but the
        // Root Identifier Service is unique only to Root Robots.
        UUID: '48c5d828-ac2a-442d-97a3-0c9822b04979',
        // service is empty and contains no characteristics.
        characteristic: {}
      },
      'DeviceInformation': {
        // service contains mostly static information about the Root Robot.
        UUID: '0000180a-0000-1000-8000-00805f9b34fb',
        // service contains the following characteristics.
        characteristic: {
          'SerialNumber': {
            // Serial number string, 12 bytes in length.
            // Ex. RT0123456789
            UUID: '00002a25-0000-1000-8000-00805f9b34fb'
          },
          'FirmwareVersion': {
            // Firmware version string, up to 12 bytes in length.
            // Ex. 1.0
            UUID: '00002a26-0000-1000-8000-00805f9b34fb'
          },
          'Hardware Version': {
            // Hardware version string, up to 12 bytes in length.
            // Ex. 1.0
            UUID: '00002a27-0000-1000-8000-00805f9b34fb'
          },
          'Manufacturer': {
            // Manufacturer name string, 13 bytes in length.
            // Ex. Root Robotics
            UUID: '00002a29-0000-1000-8000-00805f9b34fb'
          },
          'Robot State': {
            // Bitfield of select robot sensors, 2 bytes in length.
            // MSB - 0b00<Cliff><L_Bump><R_Bump><RL_Touch><RR_Touch><FL_Touch><FR_Touch>
            // LSB - 0b0<Battery Percent>
            // This characteristic is broadcast in the advertising packet.
            // It can be read without connecting to the robot to identify
            // which advertising robot is being touched.
            UUID: '00008bb6-0000-1000-8000-00805f9b34fb'
          }
        }
      },
      'UART': {
        // service represents an emulated UART port based on the
        // unofficial specifications of Nordic Semiconductor.
        UUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
        // service contains an RX and TX characteristic.
        characteristic: {
          // Send packets for robot to execute to this characteristic.
          // Accepts packets of 20 bytes.
          // Supports write with response and write without response
          // methods.
          // If using write without response method, it is the host's
          // responsibility to allow time for the robot to process the
          // packet.
          'TX': {
            UUID: '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
          },
          // Listen to this characteristic for events and responses
          // to packets.
          // Sends packets of 20 bytes.
          // Supports notify property.
          // BLE hosts must subscribe to this characteristic before
          // any data can be received from robot.
          'RX': {
            UUID: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
          }
        }
      }
    }
  }
};
