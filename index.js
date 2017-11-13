const Bowline = require('bowline')

const fahrenheitToCelcius = (f) => (f - 32) * (5 / 9)
let Service
let Characteristic

module.exports = function (homebridge) {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  homebridge.registerAccessory('homebridge-twine-temp', 'TwineTemp', TwineTemp)
}

class TwineTemp {
  constructor (log, config) {
    this.log = log
    this.name = config.name || 'twine'
    this.email = config.email
    this.password = config.password
    this.twine_id = config.twine_id
    this.client = new Bowline({
      email: this.email,
      password: this.password,
      deviceId: this.twine_id
    })
  }
  getServices () {
    this.informationService = new Service.AccessoryInformation()
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Supermechanical')
      .setCharacteristic(Characteristic.Model, 'Twine')
      .setCharacteristic(Characteristic.SerialNumber, '123-456-789')

    this.temperatureService = new Service.TemperatureSensor(this.name)
    this.temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.getState.bind(this))
      .setProps({
        minValue: -50,
        maxValue: 100
      })
    this.batteryService = new Service.BatteryService()
    this.batteryService
      .getCharacteristic(Characteristic.BatteryLevel)
      .setProps({ maxValue: 100, minValue: 0, minStep: 1 })
      .on('get', this.getBatteryLevel.bind(this))
    this.batteryService
      .getCharacteristic(Characteristic.ChargingState)
      .setProps({ maxValue: 1 })
      .on('get', this.getChargingState.bind(this))
    this.batteryService
      .getCharacteristic(Characteristic.StatusLowBattery)
      .on('get', this.getLowBatteryStatus.bind(this))
    return [this.informationService, this.batteryService, this.temperatureService]
  }
  getTemperatureUnits (callback) {
    // 0 = C, 1 = F
    this.log('Get temperature units')
    callback(null, 0)
  }
  getChargingState (callback) {
    this.client.fetch((err, response) => {
      if (!err) {
        switch (response.meta.battery) {
          case 'plugged in':
            return callback(null, 1)
          default:
            return callback(null, 0)
        }
      } else {
        callback(err)
      }
    })
  }
  getLowBatteryStatus (callback) {
    this.client.fetch((err, response) => {
      if (!err) {
        callback(null, response.meta.battery === 'weak' ? 1 : 0)
      } else {
        callback(err)
      }
    })
  }
  getBatteryLevel (callback) {
    this.client.fetch((err, response) => {
      if (!err) {
        switch (response.meta.battery) {
          case 'full':
          case 'plugged in':
            return callback(null, 100)
          case '2/3':
            return callback(null, 66)
          case '1/3':
            return callback(null, 33)
          case 'weak':
            return callback(null, 10)
          case 'unknown':
          default:
            return callback(null, 0)
        }
      } else {
        callback(err)
      }
    })
  }
  getTemp (callback) {
    this.client.fetch((err, response) => {
      if (!err) {
        this.log('Got twine data from server')
        callback(null, fahrenheitToCelcius(response.values.temperature))
      } else {
        callback(err)
      }
    })
  }
  getState (callback) {
    this.getTemp(callback)
  }
}
