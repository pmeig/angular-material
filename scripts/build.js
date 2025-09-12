"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_child_process_1 = require("node:child_process");
var node_path_1 = require("node:path");
var node_fs_1 = require("node:fs");
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
var projects = JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.resolve)(cwd, 'angular.json'), { encoding: 'utf-8' }))['projects'];
var launch = function (cwd, command) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var response = (0, node_child_process_1.spawnSync)(command, args, { cwd: cwd, encoding: 'utf-8', shell: true });
    if (response.status !== 0) {
        throw new Error("Command ".concat(command, " ").concat(args.join(' '), " failed with status ").concat(response.status));
    }
    return response.output;
};
var exec = function (command) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var response = (0, node_child_process_1.spawnSync)(command, args, { cwd: cwd, encoding: 'utf-8', env: process.env, shell: true });
    if (response.status !== 0) {
        throw new Error("Command ".concat(command, " ").concat(args.join(' '), " failed with status ").concat(response.status));
    }
    return response.output;
};
var dists = JSON.parse(exec('tsc', '--showConfig').join('')).compilerOptions.paths;
var foundTgz = function (dist) {
    var tgz = (0, node_fs_1.readdirSync)(dist).find(function (file) { return file.endsWith('.tgz'); });
    if (!tgz) {
        throw new Error("Cannot find tgz file in ".concat(dist));
    }
    return (0, node_path_1.resolve)(dist, tgz);
};
var install = function (module) {
    var dist = dists[module][0];
    if (!(0, node_fs_1.existsSync)(dist)) {
        throw new Error("Cannot find dist folder for ".concat(module));
    }
    launch(dist, 'npm', 'pack');
    exec('npm', 'install', foundTgz(dist));
};
var installModule = function (module) {
    try {
        exec('npm', 'run', 'ng', '--', 'build', module, '--configuration=production');
        install(module);
        return true;
    }
    catch (error) {
        console.debug("impossible to install module ".concat(module, ": ").concat(error.message));
        return false;
    }
};
var main = function (modules) {
    if (modules.length === 0) {
        modules = Object.keys(projects);
    }
    var retry = [];
    var replace = function (_) {
        replace = function (retry) { return retry; };
        return modules;
    };
    while (retry.length != modules.length) {
        modules = replace(retry);
        retry = [];
        for (var _i = 0, modules_1 = modules; _i < modules_1.length; _i++) {
            var module_1 = modules_1[_i];
            if (!installModule(module_1)) {
                retry.push(module_1);
            }
        }
    }
};
main(process.argv.slice(2));
