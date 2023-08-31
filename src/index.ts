import * as fs from 'fs'
import * as core from '@actions/core'
import * as artifact from '@actions/artifact'

let ejs = require('ejs')

export async function run(): Promise<void> {

  let current_date: Date = new Date()
  const date_string = current_date.toISOString();
  const runId = core.getInput('run-id') // but don't use it for anything...
  const downloadResponse = await artifact.create().downloadAllArtifacts()

  console.log(
    ejs.render(
      'State Drift Report for <%= isoDate %>', {isoDate: date_string}
    )
  )

  for (const resp of downloadResponse) {
      const dir = resp.artifactName
      // rebuild the TG path from the artifact name and drop the "plan-output" text
      const tgPath = dir.replaceAll('_','/').replaceAll('-plan-output', '');
      fs.readdir(resp.downloadPath, (err,files) => {
        if (err)
          console.log(err)
        else {
          console.log(ejs.render('Terragrunt Path: <%= path %>', {path: tgPath}))
          files.forEach(file => {
            const text = fs.readFileSync(`${dir}/${file}`, 'utf8');
            console.log(text);
          })
        }
    })
    //console.log(resp.downloadPath)
  }
}


run()
