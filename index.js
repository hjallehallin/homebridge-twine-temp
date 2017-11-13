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
    return [this.informationService, this.temperatureService]
  }
  getTemperatureUnits (callback) {
    // 0 = C, 1 = F
    this.log('Get temperature units')
    callback(null, 0)
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
