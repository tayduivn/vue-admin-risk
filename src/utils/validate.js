/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function validateParaNotNull(value) {
  return !!(value.trim())
}

export function validateParaGtZero(value) {
  return value > 0
}

export function validateArrayNotNull(value) {
  return value != null && value.length > 0
}

export function validateParamDouble(value) {
  return /^[-\+]?\d+(\.\d+)?$/.test(value)
}
