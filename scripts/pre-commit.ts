import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const actualizeCwd = () => {
  let cwd = process.cwd();
  let path = resolve(cwd, 'angular.json');
  while (path && !existsSync(path)) {
    cwd = resolve(cwd, '..');
    path = resolve(cwd, 'angular.json');
  }
  if (!path) {
    throw new Error('Cannot find angular.json');
  }
  return cwd;
};

const cwd = actualizeCwd();
const path = resolve(cwd, 'package.json');
const preCommit = resolve(cwd, '.git', 'hooks', 'pre-commit');
const packageJson = JSON.parse(readFileSync(path, {encoding: 'utf-8'}));


const removeInternalDependencies = (dependencies: Record<string, string>) => {
  return Object.entries(dependencies).filter(([key]) => !key.startsWith('@pmeig/')).reduce((acc, entry) => {
    acc[entry[0]] = entry[1];
    return acc;
  }, {} as Record<string, string>);
}

const installHookPreCommit = () => {
  if (!existsSync(preCommit)) {
    // const file = openSync(preCommit, 'w');
    // closeSync(file);
    writeFileSync(preCommit, '#!/bin/sh', {encoding: 'utf-8'});
  }
  const content = readFileSync(preCommit, {encoding: 'utf-8'});
  if (!content.includes('removeInternalDependencies')) {
    appendFileSync(preCommit, "\n" + readFileSync(resolve(cwd, 'scripts', 'pre-commit.sh'), {encoding: 'utf-8'}), {encoding: 'utf-8'})
  }
}

const main = (options: string[]) => {
  if (options.includes('--hook')) {
    packageJson.dependencies = removeInternalDependencies(packageJson.dependencies);
    packageJson.devDependencies = removeInternalDependencies(packageJson.devDependencies);
    writeFileSync(path, JSON.stringify(packageJson, null, 2));
  } else {
    installHookPreCommit();
  }
}

main(process.argv.slice(2));
