import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from '@angular/compiler-cli';
import { resolve } from 'node:path';

const foundWorkplaces = (workplace: string = '.') => {
  const path = resolve(workplace);
  if (existsSync(resolve(path, 'angular.json'))) {
    return workplace;
  }
  if (path === '/' || path.endsWith(':')) {
    console.error('Not found workplace');
    process.exit(10);
  }
  return foundWorkplaces(dirname(path));
}


const retrieveProjects = (workplace: string) => {
  const workplaces = [`${workplace}/projects`]
  const projects: {package: string, ng: string}[] = [];
  while (workplaces.length) {
    const workspace = workplaces.shift();
    const project: {package: string, ng: string} = {
      package: '', ng: ''
    }
    let subFolders = 0;
    readdirSync(workspace, { withFileTypes: true })
      .filter(dirent => {
        if (dirent.isDirectory()) {
          subFolders++;
          workplaces.push(`${workspace}/${dirent.name}`);
          return false;
        }
        return dirent.name.endsWith('package.json');
      })
      .forEach(dirent => {
        const key = dirent.name.startsWith('ng') ? 'ng' : 'package'
        project[key] = `${workspace}/${dirent.name}`;
      });
    if (project.package && project.ng) {
      while (subFolders--) {
        workplaces.pop();
      }
      projects.push(project);
    }
  }
  return projects;
}

const allowedNonPeerDependencies = (project: {package: string,
  ng: string}) => {
  const pack = JSON.parse(readFileSync(project.package, {encoding: 'utf-8'}));
  const ng = JSON.parse(readFileSync(project.ng, {encoding: 'utf-8'}));
  const allowedNonPeerDependencies = new Set<string>(ng.allowedNonPeerDependencies || []);
  Object.keys(pack.dependencies || {}).filter((key) => key.startsWith('@pmeig'))
    .forEach((key) => allowedNonPeerDependencies.add(key));
  ng.allowedNonPeerDependencies = [];
  allowedNonPeerDependencies.forEach((key) => ng.allowedNonPeerDependencies.push(key));
  writeFileSync(project.ng, JSON.stringify(ng, null, 2), {encoding: 'utf-8'});
}

const main = () => {
  const workplace = foundWorkplaces();
  retrieveProjects(workplace).forEach(allowedNonPeerDependencies);
}

main();
