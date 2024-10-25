import { execSync } from 'child_process';
import os from 'os';
import { join } from 'path';

import fs from 'fs-extra';
import { Listr } from 'listr2';
import picocolors from 'picocolors';

export default async () => {
  const DX_REPO_NAME = 'kamdz/dx';
  const DX_REPO_URL = `https://github.com/${DX_REPO_NAME}`;
  const DX_TEMP_DIR = fs.mkdtempSync(join(os.tmpdir(), 'kamdz_dx-'));
  const CURRENT_DIR = process.cwd();
  const SKIP_PATHS = ['.git', 'bin', 'src', 'package.json', 'README.MD', 'yarn.lock'];
  const INIT_PACKAGE_VALUES = {
    name: '__PROJECT_NAME__',
    version: '0.0.0-development',
    description: '',
    keywords: [],
    bugs: { url: 'https://github.com/__PROJECT_NAME__/issues' },
    repository: { type: 'git', url: 'https://github.com/__PROJECT_NAME__' },
    author: {
      name: 'Kamil Dzwonkowski',
      email: 'npm@kamdz.dev',
      url: 'https://github.com/kamdz'
    },
    dependencies: {}
  };

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
                    try {
                      const targetPackageJson = await fs.readJSON(join(CURRENT_DIR, 'package.json'));
                      const sourcePackageJson = await fs.readJSON(join(DX_TEMP_DIR, 'package.json'));
                      const workingPackagejson = { ...targetPackageJson };
                      Object.keys(workingPackagejson).forEach(key => {
                        if (!INIT_PACKAGE_VALUES.hasOwnProperty(key)) {
                          workingPackagejson[key] = sourcePackageJson[key];
                        }
                      });
                      await fs.writeJSON(join(CURRENT_DIR, 'package.json'), workingPackagejson, { spaces: '  ' });
                    } catch (err) {
                      await fs.copy(join(DX_TEMP_DIR, 'package.json'), join(CURRENT_DIR, 'package.json'));
                      const targetPackageJson = await fs.readJSON(join(CURRENT_DIR, 'package.json'));
                      const workingPackagejson = { ...targetPackageJson };
                      const keys = Object.keys(INIT_PACKAGE_VALUES) as Array<keyof typeof INIT_PACKAGE_VALUES>;
                      keys.forEach(key => {
                        workingPackagejson[key] = INIT_PACKAGE_VALUES[key];
                      });
                      await fs.writeJSON(join(CURRENT_DIR, 'package.json'), workingPackagejson, { spaces: '  ' });
                    }
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
  } catch (e: any) {
    console.error(e?.message || e);
    process.exit(e?.exitCode || 1);
  }
};
