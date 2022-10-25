import { getStatus, updateStatus, hasChange } from './status'
import { PullRequestContext } from './types'

export async function run(context: PullRequestContext) {
  try {
    const nextState = await getStatus(context)
    context.log(`[wip] Next status: ${JSON.stringify(nextState)}`)

    const changed = await hasChange(context, nextState)
    context.log(`[wip] Status changed: ${changed}`)

    if (changed) {
      await updateStatus(context, nextState)
      context.log(
        nextState.wip ? '[wip] work in progress' : '[wip] ready for review',
      )
    } else {
      context.log('[wip] status not changed')
    }
  } catch (error) {
    context.log(`[wip] ${error.message}`)
  }
}
