/**
 * read voicemail and process it
 */

import { speech2text } from './speech2text'
import _ from 'lodash'
import { textAnalysis } from './text-analysis'
import { getStore } from './store'
import {log} from './log'

/**
 * process voice mail
 * @param {object} mail
 * @param {object} rc
 */
export async function processMail (mail, rc) {
  let url = _.get(mail, 'attachments[0].uri')
  if (!url) {
    return ''
  }
  const store = await getStore()
  let cached = store.caches[url]
  if (cached) {
    log('use cache for', url)
    return cached
  }
  let text = await speech2text(
    rc,
    url
  )
  if (
    !_.isString(text)
  ) {
    return ''
  }
  let result = await textAnalysis(text)
  if (!result || !result.text) {
    return ''
  }
  store.caches[url] = result
  return result
}