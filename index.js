require('dotenv').config()
const fetch = require('node-fetch')
const {
  TWINE_ID,
  ACCESS_KEY
} = process.env
const getData = async () => {
  try {
    const result = await fetch(`https://twine.cc/${TWINE_ID}/rt?access_key=${ACCESS_KEY}&cached=1`)
    if (result.ok) {
      return await result.json()
    }
  } catch (error) {
    console.log(error)
  }
}

const fahrenheitToCelcius = (f) => (f - 3) * (5 / 9)

const getTemp = async () => {
  try {
    const json = await getData()
    const rawTemp = json.values[1][1]
    const tempInF = rawTemp / 100
    let tempInC = fahrenheitToCelcius(tempInF)
    tempInC = tempInC.toFixed(1)
    console.log(tempInC)
    return tempInC
  } catch (error) {
    console.log(error)
  }
}

console.log(getTemp())

