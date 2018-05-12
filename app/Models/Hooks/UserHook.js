'use strict'

const UserHook = exports = module.exports = {}

const flattenArray = (array) => array // Alternative to Array.prototype.flatten()
  .reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val), []) 

UserHook.chargeUser = async (modelInstance) => {
  const promises = [
    modelInstance.storageCenters().fetch(),
    modelInstance.services().fetch(),
    modelInstance.servers().fetch()
  ]

  const data = await Promise.all(promises)

  const prices = flattenArray(data)
    .map(subscriptions => subscriptions.rows
      .map(subscription => subscription['price-per-month'])
    )
  const totalPrice = flattenArray(prices).reduce((acc, val) => acc + val, 0) 
  
  modelInstance.merge({ 'charge-per-month': totalPrice })
}
