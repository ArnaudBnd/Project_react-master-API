import Validator from 'validator'
import isEmpty from 'lodash/isEmpty'

/**
* validateInput to tcheck from sign up
* @param {Object} data
* @return {Object or Boolean} errors or isValid
*/
export default function validateInput(data) {
  const errors = {}

  if (Validator.isNull(data.identifier)) {
    errors.identifier = 'This field is required'
  }

  if (Validator.isNull(data.password)) {
    errors.password = 'This field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
