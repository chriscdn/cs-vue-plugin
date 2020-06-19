const Ajv = require('ajv')
const ajv = new Ajv({
	allErrors: true
})
const moment = require('moment')

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'))

ajv.addFormat('user', {
    type: 'integer',
})

ajv.addFormat('usergroup', {
    type: 'integer',
})

ajv.addFormat('date-time', {
  validate: dateTimeString => moment.utc(dateTimeString).isValid()
})

ajv.addFormat('date', {
  validate: dateTimeString => moment.utc(dateTimeString).isValid()
})

function validate(schema, data) {
	return ajv.validate(schema, data) ? [] : ajv.errors
}

export default validate