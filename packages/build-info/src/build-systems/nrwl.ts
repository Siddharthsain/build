import { findPackages, identifyPackageFn } from '../workspaces/get-workspace-packages.js'

import { BaseBuildTool } from './build-system.js'

export class Nx extends BaseBuildTool {
  id = 'nx'
  name = 'Nx'
  configFiles = ['nx.json']

  dev = {
    commands: ['nx serve'],
    port: 4200,
  }

  async detect(): Promise<this | undefined> {
    const detected = await super.detect()
    const fs = this.project.fs
    if (detected) {
      try {
        // in nx integrated setup the workspace is not managed through the package manager
        // in this case we have to check the `nx.json` for the project references
        if (this.project.workspace === null) {
          const { workspaceLayout } = await fs.readJSON<any>(fs.join(this.project.jsWorkspaceRoot, 'nx.json'))
          // if an apps dir is specified get it.
          if (workspaceLayout?.appsDir?.length) {
            const identifyPkg: identifyPackageFn = async ({ entry, directory }) => {
              if (entry === 'project.json') {
                try {
                  // we need to check the project json for application types (we don't care about libraries)
                  const { projectType } = await fs.readJSON(fs.join(directory, entry))
                  return projectType === 'application'
                } catch {
                  return false
                }
              }
              return false
            }
            const packages = await findPackages(
              this.project,
              workspaceLayout.appsDir,
              identifyPkg,
              '*', // only check for one level
            )
            this.project.workspace = {
              isRoot: this.project.jsWorkspaceRoot === this.project.baseDirectory,
              packages,
              rootDir: this.project.jsWorkspaceRoot,
            }
          }
        }
      } catch {
        // noop
      }
      return this
    }
  }
}

export class Lerna extends BaseBuildTool {
  id = 'lerna'
  name = 'Lerna'
  configFiles = ['lerna.json']
}