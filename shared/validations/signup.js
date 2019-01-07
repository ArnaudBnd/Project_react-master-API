import Validator from 'validator'
import isEmpty from 'lodash/isEmpty'

/**
* validateInput to tcheck from sign up
* @param {Object} data
* @return {Object or Boolean} errors or isValid
*/
export default function validateInput(data) {
  const errors = {}

  if (Validator.isEmpty(data.username)) {
    errors.username = 'This field is required'
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'This field is required'
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'This field is required'
  }

  if (Validator.isEmpty(data.passwordConfirmation)) {
    errors.passwordConfirmation = 'This field is required'
  }

  if (!Validator.equals(data.password, data.passwordConfirmation)) {
    errors.passwordConfirmation = 'Passwords must match'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
