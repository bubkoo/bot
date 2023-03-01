import { Probot } from 'probot'
import { Runs, ICheck } from '../db-model'
// import { enforceProtection } from '../util'
import { createOctokit } from '../octokit'

export async function register(req: any, res: any, app: Probot): Promise<any> {
  const {
    id,
    run_id,
    name,
    sha,
    doc_path,
    //  enforce, enforce_admin
  } = req.query as { [key: string]: string }

  const run = await Runs.findById(id)
  if (!run) {
    return res.sendStatus(404)
  }

  if (run.sha !== sha) {
    // Although unlikely, make sure that people can't create checks by
    // submitting random IDs (mongoose IDs are not-so-random)
    return res.sendStatus(404)
  }

  const octokit = await createOctokit(app, run.repo.owner)

  const check_data: any = {
    owner: run.repo.owner,
    repo: run.repo.name,
    head_sha: run.sha,
    name,
    details_url: `https://github.com/${run.repo.owner}/${run.config.host_repo}/actions/runs/${run_id}`,
    status: 'in_progress',
  }

  // eslint-disable-next-line no-console
  console.log(run, doc_path)

  if (doc_path) {
    try {
      const docs = await octokit.repos.getContent({
        owner: run.repo.owner,
        repo: run.config.host_repo,
        path: doc_path,
      })

      const summary = Buffer.from(
        (docs.data as any).content,
        (docs.data as any).encoding,
      ).toString()
      // eslint-disable-next-line no-console
      console.log(summary)
      check_data.output = { title: name, summary }
    } catch (e) {
      // pass
    }
  }

  const { data: checks_run } = await octokit.checks.create(check_data)
  const checkInfo: ICheck = {
    name: check_data.name,
    run_id: Number(run_id),
    checks_run_id: checks_run.id,
  }

  await Runs.findByIdAndUpdate(id, { $push: { checks: checkInfo } })
  return res.sendStatus(200)
}
