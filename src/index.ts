import * as fs from 'fs'
import * as core from '@actions/core'
import * as artifact from '@actions/artifact'

let ejs = require('ejs')

export async function run(): Promise<void> {

  let date: Date = new Date()
  const runId = core.getInput('run-id') // but don't use it for anything...
  const downloadResponse = await artifact.create().downloadAllArtifacts()

  console.log(
    ejs.render(
      'State Drift Report for <%= isoDate %>', {isoDate: date.toISOString()}
    )
  )

  for (const resp of downloadResponse) {
      const dir = resp.artifactName
      // rebuild the TG path from the artifact name and drop the "plan-output" text
      const tgPath = dir.replaceAll('_','/').replaceAll('-plan-output', '');
      console.log(
        ejs.render(
          'Terragrunt Path: <%= path %>', {path: tgPath}
        )
      )
      fs.readdir(resp.downloadPath, (err,files) => {
        if (err)
          console.log(err)
        else {
          files.forEach(file => {
            console.log(`${dir}/${file}`);
            const text = fs.readFileSync(`${dir}/${file}`, 'utf8');
            console.log(text);
          })
        }
    })
    //console.log(resp.downloadPath)
  }
}


run()
