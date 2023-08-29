import * as fs from 'fs'
import * as core from '@actions/core'
import * as artifact from '@actions/artifact'

export async function run(): Promise<void> {
  const runId = core.getInput('run-id') // but don't use it for anything...
  const downloadResponse = await artifact.create().downloadAllArtifacts()
  for (const resp of downloadResponse) {
    console.log(fs.readFileSync(resp.downloadPath))
  }
}

run()
