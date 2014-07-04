#!/usr/bin/env node

var util = require('./tk-util'),
    clc = require('cli-color'),
    fs = require('fs'),
    handlebars = require('handlebars'),
    error = clc.red.bold,
    warn = clc.yellow,
    notice = clc.blue,
    success = clc.green,
    inquirer = require('inquirer'),
    path = require('path'),
    readLine = require ("readline"),
    _ = require('underscore'),
    Q = require('q'),
    bower = require('bower'),
    modulepath = path.dirname(fs.realpathSync(__filename));


var scaffolder = function() {
	var self = this;

  self.config = null;
  self.commands = [
    {
      value: "vm",
      name: "Create a VM/Spec"
    },
    {
      value: "vmfull",
      name: "Create a VM/View/Spec"
    },
    {
      value: "prepare",
      name: "Prepare the project structure"
    },
    {
      value: "install",
      name: "Install Durandal via Bower"
    },
    {
      value: "karma-config",
      name: "Create the default Karma configuration file"
    },
    {
      value: "exit",
      name: "Exit"
    }
  ];

  self.createVM = function(name) {
    var deferred = Q.defer();
    util.readFile(path.join(modulepath, "templates/vm_template.js"), function(data) {
      var vmTemplate = handlebars.compile(data);
      util.createFile(path.join(self.config
                                    .destination
                                    .appFolder,
                                self.config
                                    .destination
                                    .vmFolder, name + ".js"), vmTemplate({
        "name": name
      }), function() {
        deferred.resolve();
      });
    });

    return deferred.promise;
  };

  self.createSpec = function(name) {
    var deferred = Q.defer();
    util.readFile(path.join(modulepath, "templates/spec_template.js"), function(data) {
      var specTemplate = handlebars.compile(data);
      util.createFile(path.join(self.config
                                    .destination.specFolder,
                                name + ".spec.js"), specTemplate({
        "name": name
      }), function() {
        deferred.resolve();
      });
    });

    return deferred.promise;
  };

  self.createView = function(name) {
    var deferred = Q.defer();
    util.readFile(path.join(modulepath, "./templates/view_template.html"), function(data) {
      var viewTemplate = handlebars.compile(data);
      util.createFile(path.join(self.config
                                    .destination
                                    .appFolder,
                                self.config
                                    .destination
                                    .viewFolder,
                                name + ".html"), viewTemplate({
        "name": name
      }), function() {
        deferred.resolve();
      });
    });

    return deferred.promise;
  };

  self.generateVM = function(name) {
    return Q.all([
      self.createVM(name),
      self.createSpec(name)
    ]);
  };

	self.generateFullVM = function(name) {
    return Q.all([
      self.createVM(name),
      self.createView(name),
      self.createSpec(name)
    ]);
	};

  self.processPrepare = function() {
    var deferred = Q.defer();
    try {
      fs.mkdirSync("./app");
      fs.mkdirSync("./app/viewmodels");
      fs.mkdirSync("./app/views");
      fs.mkdirSync("./test");
      fs.mkdirSync("./test/specs");
      console.log(success("Structure created!"));

      util.readFile(path.join(modulepath, "./templates/durandal_main.js"), function(data) {
        util.createFile("app/main.js", data, function() {
          console.log(success("App main.js created!"));
          console.log(warn("Please adapt the main.js file according to your needs"));
          deferred.resolve();
        });
      });
    } catch (ex) {
      if(ex.errno === 47) {
        console.log(error("Structure already exists"));
        deferred.reject(new Error("Structure already exists"));
      }
    }
    return deferred.promise;
  };

  self.processVMFull = function() {
    var deferred = Q.defer();
    if(process.argv.length < 4) {
      self.askForVMName().then(function(vmname) {
         self.generateFullVM(vmname).then(function() {
          deferred.resolve();
         });
      });
    } else {
      var vmname = process.argv.slice(3)[0];
      self.generateFullVM(vmname).then(function() {
        deferred.resolve();
      });
    }

    return deferred.promise;
  };

  self.processVM = function() {
    var deferred = Q.defer();

    if(process.argv.length < 4) {
      self.askForVMName().then(function(vmname) {
         self.generateVM(vmname).then(function() {
          deferred.resolve();
         });
      });
    } else {
      var vmname = process.argv.slice(3)[0];
      self.generateVM(vmname).then(function() {
        deferred.resolve();
      });
    }

    return deferred.promise;
  };

  self.installDurandalBower = function() {
    var deferred = Q.defer();
    console.log("");

    bower.commands.install(["durandal"], {}).on('log', function(data) {
      process.stdout.write(warn("█ "));
    })
    .on('error', function(data) {
      console.log(error("Error while installing Durandal via Bower"));
      deferred.reject(data);
    }).on('end', function(data) {
      bower.commands.install(["bootstrap"], {}).on('log', function(data) {
        process.stdout.write(warn("█ "));
      }).on('end', function(data) {
        console.log(success("\n\nInstallation complete!"));
        deferred.resolve();
      }).on('error', function(data) {
        console.log(error("Error while installing Twitter Bootstrap via Bower"));
        deferred.reject(data);
      });
    });
    return deferred.promise;
  };

  self.setup = function() {
    var deferred = Q.defer();
    util.readFile(path.join(modulepath, "./config.json"), function(data) {
      util.createFile("ds.config.json", data, function() {
        console.log(warn("Please adapt the config file to match your project"));
        process.exit(1);
      });
    });

    return deferred.promise;
  };

  self.askForVMName = function() {
    var deferred = Q.defer();
    inquirer.prompt([{
      name: "vmName",
      message: "Specify the VM name:"
    }], function(answers) {
      deferred.resolve(answers.vmName);
    });

    return deferred.promise;
  };

  self.createKarmaConfig = function() {
    var deferred = Q.defer();
    util.readFile(path.join(modulepath, "templates/test-main.js"), function(data) {
      util.createFile("test-main.js", data, function() {
        console.log(warn("Please add your additional dependencies to the karma config file \"test-main.js\""));
        process.exit(1);
      });
    });

    return deferred.promise;
  };

  self.processSelection = function(commandParam, shouldRepeat) {
    var promise;

    switch(commandParam) {
      case "setup":
        promise = self.setup();
        break;
      case "prepare":
        promise = self.processPrepare();
        break;
      case "vmfull":
        promise = self.processVMFull();
        break;
      case "vm":
        promise = self.processVM();
        break;
      case "install":
        promise = self.installDurandalBower();
        break;
      case "karma-config":
        promise = self.createKarmaConfig();
        break;
      case "exit":
        process.emit ("SIGINT");
        return;
      default:
        process.emit ("SIGINT");
    }

    promise.then(function() {
      if(shouldRepeat) {
        self.initProcess(undefined);
      } else {
        process.exit(1);
      }
    }, function(reason) {
      process.exit(1);
    });
  };

  self.checkPrerequisites = function() {
    if(!fs.existsSync("ds.config.json")) {
      return false;
    } else {
      return true;
    }
  };

  self.initProcess = function(commandPrompt) {
    if(!self.checkPrerequisites() && commandPrompt !== "setup")
    {
      console.log(warn("ds.config.json is missing.\nRun ") +
                  "ds setup" +
                  warn(" to create a default config file"));
      process.exit(-7);
      return;
    }

    if(commandPrompt !== "setup")
      self.loadConfig();

    if(commandPrompt === undefined) {
      console.log("");
      inquirer.prompt([{
        type: "list",
        name: "commandPrompt",
        message: "Choose a command:",
        choices: self.commands
      }], function(answers) {
        self.processSelection(answers.commandPrompt, true);
      });
    } else {
      self.processSelection(commandPrompt, false);
    }
  };

  self.loadConfig = function() {
    var deferred = Q.defer();
    util.readFile("./ds.config.json", function(data) {
      self.config = JSON.parse(data);
      deferred.resolve();
    });

    return deferred.promise;
  };
};

if (process.platform === "win32"){
    var rl = readLine.createInterface ({
        input: process.stdin,
        output: process.stderr
    });

    rl.on ("SIGINT", function (){
        process.emit ("SIGINT");
    });
}

process.on('SIGINT', function() {
  console.log("\n\n~~~~~~~ Good bye ~~~~~~~");
  process.exit(1);
});

var userArgs = process.argv.slice(2);
var guided = (userArgs === undefined || userArgs.length === 0) ? true : false;
var instance = new scaffolder();
instance.initProcess(guided !== true ? userArgs[0] : undefined);
