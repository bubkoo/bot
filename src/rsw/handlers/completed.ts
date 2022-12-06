import { Context } from 'probot'
import { Runs } from '../db-model'

export async function complete(context: Context<'workflow_run.completed'>) {
  const payload = context.payload.workflow_run
  const id = payload.id
  if (!id) {
    return
  }

  const run = await Runs.findOne({ 'checks.run_id': { $in: id } })
  if (!run) {
    return
  }

  if (context.payload.repository.name !== run.config.host_repo) {
    return
  }

  const check = run.checks.find((check) => check.run_id === id)
  if (!check) {
    return
  }

  await context.octokit.checks.update({
    owner: run.repo.owner,
    repo: run.repo.name,
    check_run_id: check.checks_run_id,
    name: `${check.name}`,
    status: payload.status,
    conclusion: payload.conclusion,
  })
}
