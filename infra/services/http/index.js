import axios from 'axios'
import canceler from 'axios-cancel'
import { Auth } from 'genesis'
import { URL_API } from 'genesis/support'
import { loading } from 'genesis/support/message'

import configure from './configure'

/**
 * @type {Object}
 */
const HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

/**
 * @param {string} baseURL
 * @param {Object} headers
 * @return {AxiosInstance}
 */
export const create = (baseURL = '', headers = {}) => {
  return axios.create({
    baseURL: baseURL || URL_API,
    headers: Object.assign({}, HEADERS, headers)
  })
}

/**
 * @type {Axios}
 */
export const http = create()

/**
 * @returns {Axios}
 */
export const install = () => {
  configure(http)

  canceler(http, {
    debug: false // process.env.DEV
  })
  return http
}

/**
 * @param {string} token
 */
export const setToken = token => {
  const configureToken = Auth.get('token')
  configureToken(http, token)
}

/**
 * @param {string} reason
 */
export const abort = reason => {
  http.cancelAll(reason)
  loading(false)
}

/**
 * @param {string} requestId
 */
export const cancel = (requestId) => {
  http.cancel(requestId)
  loading(false)
}

/**
 * @type {Axios}
 */
export default http
