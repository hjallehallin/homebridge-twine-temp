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

const getTemp = async () => {
  try {
    const json = await getData()
    const rawTemp = json.values[1][1]
    const tempInF = rawTemp / 100
    let tempInC = (tempInF - 32) * (5 / 9)
    tempInC = tempInC.toFixed(1)
    return tempInC
  } catch (error) {
    console.log(error)
  }
}

console.log(getTemp())

