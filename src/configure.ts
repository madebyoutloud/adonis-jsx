import path from 'node:path'
import type Configure from '@adonisjs/core/commands/configure'

export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  await codemods.makeUsingStub(path.resolve(import.meta.dirname, '..', 'stubs'), 'config/jsx.stub', {})

  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@outloud/adonis-jsx/provider')
  })
}
