import { deletePassword, findCredentials } from 'keytar'
import { yellow } from 'kleur'
import { GluegunCommand } from 'gluegun'
import { PASSWORD_NAMESPACE } from '../constants'

const command: GluegunCommand = {
  name: 'logout',
  run: async ({ print }) => {
    const list = await findCredentials(PASSWORD_NAMESPACE)

    await Promise.all(
      list.map(async (site) => {
        await deletePassword(PASSWORD_NAMESPACE, site.account)
      })
    )
    print.info(yellow('You have been logged out!'))
  },
}

export default command
