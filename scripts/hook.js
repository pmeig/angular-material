"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var actualizeCwd = function () {
    var cwd = process.cwd();
    var path = (0, node_path_1.resolve)(cwd, 'angular.json');
    while (path && !(0, node_fs_1.existsSync)(path)) {
        cwd = (0, node_path_1.resolve)(cwd, '..');
        path = (0, node_path_1.resolve)(cwd, 'angular.json');
    }
    if (!path) {
        throw new Error('Cannot find angular.json');
    }
    return cwd;
};
var cwd = actualizeCwd();
var path = (0, node_path_1.resolve)(cwd, 'package.json');
var packageJson = JSON.parse((0, node_fs_1.readFileSync)(path, { encoding: 'utf-8' }));
var removeInternalDependencies = function (dependencies) {
    return Object.entries(dependencies).filter(function (_a) {
        var key = _a[0];
        return !key.startsWith('@pmeig/') || key.endsWith('/ng-core');
    }).reduce(function (acc, entry) {
        acc[entry[0]] = entry[1];
        return acc;
    }, {});
};
var installHook = function (name) {
    if (!name) {
        installHook('pre-commit');
        (0, node_fs_1.appendFileSync)((0, node_path_1.resolve)(cwd, '.git', 'hooks', 'pre-commit'), "\ngit stage $(pwd)/package.json", { encoding: 'utf-8' });
        installHook('post-commit');
    }
    else {
        var hook = (0, node_path_1.resolve)(cwd, '.git', 'hooks', name);
        if (!(0, node_fs_1.existsSync)(hook)) {
            (0, node_fs_1.writeFileSync)(hook, '#!/bin/sh', { encoding: 'utf-8' });
        }
        var content = (0, node_fs_1.readFileSync)(hook, { encoding: 'utf-8' });
        var newContent = "node $(pwd)/scripts/hook.js --".concat(name);
        if (!content.includes(newContent)) {
            (0, node_fs_1.appendFileSync)(hook, "\n" + newContent, { encoding: 'utf-8' });
        }
    }
};
var main = function (options) {
    var option = options.shift();
    if (option === '--pre-commit') {
        (0, node_fs_1.writeFileSync)((0, node_path_1.resolve)(cwd, '.git', 'hooks', 'package.json'), (0, node_fs_1.readFileSync)(path), { encoding: 'utf-8' });
        packageJson.dependencies = removeInternalDependencies(packageJson.dependencies);
        packageJson.devDependencies = removeInternalDependencies(packageJson.devDependencies);
        (0, node_fs_1.writeFileSync)(path, JSON.stringify(packageJson, null, 2));
    }
    else if (option === '--post-commit') {
        var tmp = (0, node_path_1.resolve)(cwd, '.git', 'hooks', 'package.json');
        if ((0, node_fs_1.existsSync)(tmp)) {
            (0, node_fs_1.writeFileSync)(path, (0, node_fs_1.readFileSync)(tmp), { encoding: 'utf-8' });
            (0, node_fs_1.rmSync)(tmp, { force: true });
        }
    }
    else {
        installHook();
    }
};
main(process.argv.slice(2));
