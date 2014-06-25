var fs = require('fs'),
    clc = require('cli-color'),
    success = clc.green,
    error = clc.red.bold;

var createFile = function(filename, content, cb) {
	fs.writeFile(filename, content, function (err) {
    if (err) return console.log(err);
    console.log(success('* File ' + filename + ' successfully written'));
    if(cb !== undefined)
      cb();
  });
};

var readFile = function(file, cb) {
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) {
        return console.log(error(err));
      }
      cb(data);
    });
};

exports.createFile = createFile;
exports.readFile = readFile;
