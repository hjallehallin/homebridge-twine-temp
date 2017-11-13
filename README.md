# Homebridge plugin for Twine temperature sensor

Fetch temperature data from your [Twine](https://twine.cc)

## Configuration

Add your device id and access key to config.json, you can find them in the
share widget on [twine.cc](https://twine.cc)

```json
{
  "accessory": "TwineTemp",
  "name": "Temperature",
  "twine_id": "",
  "email": "",
  "password": ""
}
```

### Disclaimer

This plugin is not affiliated with SuperMechanical in any way. And might
break your api rate limit.