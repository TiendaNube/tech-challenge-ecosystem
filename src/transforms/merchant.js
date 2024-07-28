const {
    applySpec,
    prop,
} = require('ramda')

module.exports = applySpec({
    id: prop('merchantId')
})
