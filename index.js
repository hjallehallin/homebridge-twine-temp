const fetch = require('node-fetch')

const fahrenheitToCelcius = (f) => (f - 32) * (5 / 9)

module.exports = function (homebridge) {
  const Service = homebridge.hap.Service
  const Characteristic = homebridge.hap.Characteristic
  class TwineTemp {
    constructor (log, config) {
      this.log = log
      this.name = config.name || 'twine'
      this.twine_id = config.twine_id
      this.access_key = config.access_key
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
    }
    getTemperatureUnits (callback) {
      // 0 = C, 1 = F
      this.log('Get temperature units')
      callback(null, 0)
    }
    async getTemp () {
      try {
        const result = await fetch(`https://twine.cc/${this.twine_id}/rt?access_key=${this.access_key}&cached=1`)
        const json = await result.json()
        const rawTemp = json.values[1][1]
        const tempInF = rawTemp / 100
        let tempInC = fahrenheitToCelcius(tempInF)
        tempInC = tempInC.toFixed(1)
      } catch (error) {

      }
    }
    async getState (callback) {
      try {
        const temp = await this.getTemp()
        callback(null, temp)
      } catch (error) {
        this.log(`getTemp error`)
        callback(error)
        return error
      }
    }
  }
  homebridge.registerAccessory('homebridge-twine-temp', 'TwineTemp', TwineTemp)
}

