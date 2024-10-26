import { execSync } from 'child_process';
import os from 'os';
import { basename, join } from 'path';

import fs from 'fs-extra';
import { Listr } from 'listr2';
import picocolors from 'picocolors';

import packageJson from '../package.json';

export default async () => {
  const DX_REPO_NAME = packageJson.name.replace('@', '');
  const DX_REPO_URL = `https://github.com/${DX_REPO_NAME}`;

  const DX_TEMP_DIR = fs.mkdtempSync(join(os.tmpdir(), 'DX_'));
  const CURRENT_DIR = process.cwd();
  const INIT_PROJECT_NAME = basename(CURRENT_DIR);
  const INIT_PROJECT_URL = `${packageJson.author.url}/${INIT_PROJECT_NAME}`;
  const INIT_PACKAGE_VALUES = {
    name: INIT_PROJECT_NAME,
    version: '0.0.0-development',
    private: true,
    description: '',
    keywords: [],
    bugs: { url: `${INIT_PROJECT_URL}/issues` },
    repository: { type: 'git', url: `git+${INIT_PROJECT_URL}.git` },
    author: packageJson.author,
    dependencies: {}
  };
  const SKIP_PATHS = ['.git', 'bin', 'src', 'package.json', 'CHANGELOG.md', 'README.MD', 'yarn.lock'];

  const update = new Listr([
    {
      title: `Updating project with latest ${picocolors.bold(`@${DX_REPO_NAME}`)}`,
      task: (_, task): Listr =>
        task.newListr(
          [
            {
              title: 'Cloning template',
              task: async (): Promise<void> => {
                execSync(`git clone ${DX_REPO_URL} ${DX_TEMP_DIR} --quiet`);
              }
            },
            {
              title: 'Syncing',
              task: (_, task): Listr => {
                const items = fs.readdirSync(DX_TEMP_DIR).filter(item => !SKIP_PATHS.includes(item));
                const tasks = items.map(item => {
                  return {
                    title: item,
                    task: async (): Promise<void> => {
                      await fs.copy(join(DX_TEMP_DIR, item), join(CURRENT_DIR, item));
                    }
                  };
                });
                tasks.push({
                  title: 'package.json',
                  task: async (): Promise<void> => {
                    fs.readJSON(join(CURRENT_DIR, 'package.json'))
                      .then(async packageJson => {
                        const dxPackageJson = await fs.readJSON(join(DX_TEMP_DIR, 'package.json'));
                        const workingPackagejson = { ...packageJson };
                        Object.keys(workingPackagejson).forEach(key => {
                          if (key in INIT_PACKAGE_VALUES) {
                            if (['scripts', 'devDependencies'].includes(key)) {
                              workingPackagejson[key] = Object.assign(workingPackagejson[key], dxPackageJson[key]);
                            } else {
                              workingPackagejson[key] = dxPackageJson[key];
                            }
                          }
                        });
                        await fs.writeJSON(join(CURRENT_DIR, 'package.json'), workingPackagejson, { spaces: '  ' });
                      })
                      .catch(async () => {
                        const dxPackageJson = await fs.readJSON(join(DX_TEMP_DIR, 'package.json'));
                        const workingPackagejson = { ...dxPackageJson };
                        const keys = Object.keys(INIT_PACKAGE_VALUES) as Array<keyof typeof INIT_PACKAGE_VALUES>;
                        keys.forEach(key => {
                          workingPackagejson[key] = INIT_PACKAGE_VALUES[key];
                        });
                        await fs.writeJSON(join(CURRENT_DIR, 'package.json'), workingPackagejson, { spaces: '  ' });
                      });
                  }
                });
                return task.newListr(tasks, { concurrent: true });
              }
            }
          ],
          { rendererOptions: { collapseSubtasks: false } }
        )
    }
  ]);

  try {
    await update.run();
    await fs.remove(DX_TEMP_DIR);
  } catch (e: unknown) {
    console.error(e);
    process.exit(1);
  }
};
