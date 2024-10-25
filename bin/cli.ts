#!/usr/bin/env node
import { program } from 'commander';

import update from '@/update';
import packageJson from '../package.json';

program
  .version(packageJson.version)
  .description(packageJson.description)
  .action(() => {
    update();
  });

program.parse(process.argv);
