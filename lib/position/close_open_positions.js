'use strict'

const debug = require('debug')('hf:strategy:position:close_open')
const closePositionMarket = require('./close_position_market')
const getLastPrice = require('../data/get_last_price')
const getPosition = require('../data/get_position')

/**
 * @param {Object} state
 * @return {Object} nextState
 */
module.exports = async (state = {}) => {
  let strategyState = state

  const symbols = Object.keys(state.positions)

  if (symbols.length > 0) {
    let symbol

    debug(
      'closing %d open positions [%s]',
      symbols.length, symbols.join(', ')
    )

    for (let i = 0; i < symbols.length; i += 1) {
      symbol = symbols[i]

      const p = getPosition(state, symbol)
      const lastPrice = getLastPrice(strategyState, symbol)

      if (!lastPrice) {
        continue
      }

      const { mts, price } = lastPrice

      debug(
        'closing position on %s (%f @ %f) with MARKET (%f) [%d]',
        symbol, p.amount, p.price, price, mts
      )

      strategyState = await closePositionMarket(strategyState, {
        symbol, mts, price,
        label: 'close open positions'
      })
    }
  }

  return strategyState
}