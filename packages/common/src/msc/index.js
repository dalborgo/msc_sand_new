import reduce from 'lodash/reduce'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'

export const getTypeOfGoods = () => {
  return require('./files/typeOfGoods.json')
}

export const getTypeOfGood = key => {
  const types = require('./files/typeOfGoods.json')
  return find(types, { key }) || {}
}

export const getCountryList = () => {
  const ports = require('./files/ports.json')
  return sortBy(reduce(ports, (prev, _, key) => {
    prev.push({ value: key })
    return prev
  }, []), 'value')
}

export const getPortList = country => {
  const ports = require('./files/ports.json')
  return sortBy(ports[country], 'value')
}
