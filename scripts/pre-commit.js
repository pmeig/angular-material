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
var preCommit = (0, node_path_1.resolve)(cwd, '.git', 'hooks', 'pre-commit');
var packageJson = JSON.parse((0, node_fs_1.readFileSync)(path, { encoding: 'utf-8' }));
var removeInternalDependencies = function (dependencies) {
    return Object.entries(dependencies).filter(function (_a) {
        var key = _a[0];
        return !key.startsWith('@pmeig/');
    }).reduce(function (acc, entry) {
        acc[entry[0]] = entry[1];
        return acc;
    }, {});
};
var installHookPreCommit = function () {
    if (!(0, node_fs_1.existsSync)(preCommit)) {
        // const file = openSync(preCommit, 'w');
        // closeSync(file);
        (0, node_fs_1.writeFileSync)(preCommit, '#!/bin/sh', { encoding: 'utf-8' });
    }
    var content = (0, node_fs_1.readFileSync)(preCommit, { encoding: 'utf-8' });
    if (!content.includes('removeInternalDependencies')) {
        (0, node_fs_1.appendFileSync)(preCommit, "\n" + (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(cwd, 'scripts', 'pre-commit.sh'), { encoding: 'utf-8' }), { encoding: 'utf-8' });
    }
};
var main = function (options) {
    if (options.includes('--hook')) {
        packageJson.dependencies = removeInternalDependencies(packageJson.dependencies);
        packageJson.devDependencies = removeInternalDependencies(packageJson.devDependencies);
        (0, node_fs_1.writeFileSync)(path, JSON.stringify(packageJson, null, 2));
    }
    else {
        installHookPreCommit();
    }
};
main(process.argv.slice(2));
