import Validator from 'validator'
import isEmpty from 'lodash/isEmpty'

/**
* validateInput to tcheck from sign up
* @param {Object} data
* @return {Object or Boolean} errors or isValid
*/
export default function validateInput(data) {
  return new Promise(() => {
    const errors = {}

    if (Validator.isNull(data.username)) {
      errors.username = 'This field is required'
    }

    if (Validator.isNull(data.email)) {
      errors.email = 'This field is required'
    }

    if (Validator.isEmail(data.email)) {
      errors.email = 'Email is invalid'
    }

    if (Validator.isNull(data.passwordDigest)) {
      errors.password = 'This field is required'
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
  })
}
