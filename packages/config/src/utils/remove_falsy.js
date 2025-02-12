import { includeKeys } from 'filter-obj'

// Remove falsy values from object
export const removeFalsy = function (obj) {
  return includeKeys(obj, (key, value) => isTruthy(value))
}

export const removeUndefined = function (obj) {
  return includeKeys(obj, (key, value) => isDefined(value))
}

export const isTruthy = function (value) {
  return isDefined(value) && (typeof value !== 'string' || value.trim() !== '')
}

export const isDefined = function (value) {
  return value !== undefined && value !== null
}
