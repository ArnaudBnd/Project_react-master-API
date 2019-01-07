import Validator from 'validator'
import isEmpty from 'lodash/isEmpty'

/**
* validateInput to tcheck from sign up
* @param {Object} data
* @return {Object or Boolean} errors or isValid
*/
export default function validatePassword(data) {
  const errors = {}

  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match '
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
