import { Probot } from 'probot'
import { Runs, ICheck } from '../db-model'
import { enforceProtection } from '../util'

export async function register(req: any, res: any, app: Probot): Promise<any> {
  const { id, run_id, name, sha, doc_path, enforce, enforce_admin } =
    req.query as { [key: string]: string }

  const run = await Runs.findById(id)
  if (!run) {
    return res.sendStatus(404)
  }

  if (run.sha !== sha) {
    // Although unlikely, make sure that people can't create checks by
    // submitting random IDs (mongoose IDs are not-so-random)
    return res.sendStatus(404)
  }

  const data: any = {
    owner: run.repo.owner,
    repo: run.repo.name,
    head_sha: run.sha,
    name: name as string,
    details_url: `https://github.com/${run.repo.owner}/${run.config.host_repo}/actions/runs/${run_id}`,
    status: 'in_progress',
    output: undefined,
  }

  let octokit = await app.auth()
  const installation = await octokit.apps.getOrgInstallation({
    org: run.repo.owner,
  })
  octokit = await app.auth(installation.data.id)

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
      data.output = { title: name, summary }
    } catch (e) {
      // console.error(e)
    }
  }

  const checks_run = await octokit.checks.create(data)

  enforceProtection(
    octokit,
    {
      owner: run.repo.owner,
      repo: run.repo.name,
    },
    data.name,
    enforce === 'true',
    // Exclude the repository that contains the workflow.
    enforce_admin === 'true' && run.repo.name !== run.config.host_repo,
  )

  const checkInfo: ICheck = {
    name: data.name,
    run_id: Number(run_id),
    checks_run_id: checks_run.data.id,
  }

  await Runs.findByIdAndUpdate(id, { $push: { checks: checkInfo } })
  return res.sendStatus(200)
}
