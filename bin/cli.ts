#!/usr/bin/env node
import { program } from 'commander';

import update from '@/update';

import packageJson from '../package.json';

program
  .version(packageJson.version)
  .description(packageJson.description)
  .argument('[path]', 'optional path (default: current directory)')
  .action(path => {
    update(path);
  });

program.parse(process.argv);
