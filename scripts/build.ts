import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

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
const projects = JSON.parse(readFileSync(resolve(cwd, 'angular.json'), {encoding: 'utf-8'}))['projects'] as Record<string, any>;

const launch = (cwd: string, command: string, ...args: string[]) => {
  let response = spawnSync(command, args, {cwd, encoding: 'utf-8', shell: true});
  if (response.status !== 0) {
    throw new Error(`Command ${command} ${args.join(' ')} failed with status ${response.status}`);
  }
  return response.output;
}

const exec = (command: string, ...args: string[]) => {
  let response = spawnSync(command, args,{cwd, encoding: 'utf-8', env: process.env, shell: true});
  if (response.status !== 0) {
    throw new Error(`Command ${command} ${args.join(' ')} failed with status ${response.status}`);
  }
  return response.output
}

const dists = JSON.parse(exec('tsc', '--showConfig').join('')).compilerOptions.paths as Record<string, string[]>;

const foundTgz = (dist: string) => {
  const tgz = readdirSync(dist).find(file => file.endsWith('.tgz'));
  if (!tgz) {
    throw new Error(`Cannot find tgz file in ${dist}`);
  }
  return resolve(dist, tgz);
}

const install = (module: string) => {
  const dist = dists[module][0];
  if (!existsSync(dist)) {
    throw new Error(`Cannot find dist folder for ${module}`);
  }
  launch(dist, 'npm', 'pack');
  exec('npm', 'install', foundTgz(dist));
};

const installModule = (module: string) => {
  try {
    exec('npm', 'run', 'ng', '--', 'build', module, '--configuration=production');
    install(module);
    return true;
  } catch (error: any) {
    console.debug(`impossible to install module ${module}: ${error.message}`);
    return false;
  }
}

const main = (modules: string[]) => {
  if (modules.length === 0) {
    modules = Object.keys(projects);
  }
  let retry: string[] = [];
  let replace = (_: string[]) => {
    replace = retry => retry;
    return modules;
  }
  while (retry.length != modules.length) {
    modules = replace(retry);
    retry = [];
    for (const module of modules) {
      if (!installModule(module)) {
        retry.push(module);
      }
    }
  }
};

main(process.argv.slice(2));
