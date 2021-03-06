/**
 * user oauth by tyler
 */

import {result} from './common'
import {User, store} from './store'

export default async (event) => {
  const user = new User()
  await user.authorize(event.queryStringParameters.code)
  const [groupId, botId] = event.queryStringParameters.state.split(':')
  const bot = await store.getBot(botId)

  await bot.sendMessage(groupId, { text: `![:Person](${user.token.owner_id}), you have successfully authorized me to access your RingCentral data!` })

  await user.addGroup(groupId, botId)
  await bot.sendMessage(groupId, { text: `![:Person](${user.token.owner_id}), your voicemail is monitored!\nIf you want me to **stop monitor** your voicemail, please reply "![:Person](${botId}) unmonitor"` })

  return result(
    '<div style="text-align: center;font-size: 20px;border: 5px solid #08c;padding: 30px;">You have authorized the bot to access your RingCentral data! Please close this page and get back to Glip</div>'
  )
}
