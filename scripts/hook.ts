import { appendFileSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
const packageJson = JSON.parse(readFileSync(path, {encoding: 'utf-8'}));


const removeInternalDependencies = (dependencies: Record<string, string>) => {
  return Object.entries(dependencies).filter(([_, value]) => !value.startsWith('file:')).reduce((acc, entry) => {
    acc[entry[0]] = entry[1];
    return acc;
  }, {} as Record<string, string>);
}

const installHook = (name?: 'pre-commit' | 'post-commit') => {
  if (!name) {
    installHook('pre-commit');
    appendFileSync(resolve(cwd, '.git', 'hooks', 'pre-commit'), "\ngit stage $(pwd)/package.json", {encoding: 'utf-8'});
    installHook('post-commit');
  } else {
    const hook = resolve(cwd, '.git', 'hooks', name);
    if (!existsSync(hook)) {
      writeFileSync(hook, '#!/bin/sh', {encoding: 'utf-8'});
    }
    const content = readFileSync(hook, {encoding: 'utf-8'});
    const newContent = `node $(pwd)/scripts/hook.js --${name}`
    if (!content.includes(newContent)) {
      appendFileSync(hook, "\n" + newContent, {encoding: 'utf-8'})
    }
  }
}

const main = (options: string[]) => {
  const option = options.shift();
  if (option === '--pre-commit') {
    writeFileSync(resolve(cwd, '.git', 'hooks', 'package.json'), readFileSync(path), {encoding: 'utf-8'});
    packageJson.dependencies = removeInternalDependencies(packageJson.dependencies);
    packageJson.devDependencies = removeInternalDependencies(packageJson.devDependencies);
    writeFileSync(path, JSON.stringify(packageJson, null, 2));
  } else if (option === '--post-commit') {
    const tmp = resolve(cwd, '.git', 'hooks', 'package.json');
    if (existsSync(tmp)) {
      writeFileSync(path, readFileSync(tmp), {encoding: 'utf-8'});
      rmSync(tmp, {force: true});
    }
  } else {
    installHook();
  }
}

main(process.argv.slice(2));
