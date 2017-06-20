'use strict';

// jshint node:true
var heads = require('robohydra').heads;
var RoboHydraHeadFilesystem = heads.RoboHydraHeadFilesystem;
var RoboHydraHeadProxy = heads.RoboHydraHeadProxy;
var RoboHydraHeadFilter = heads.RoboHydraHeadFilter;
var fs = require('fs');
var path = require('path');
var util = require('util');

try {
  var file = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf-8');
  var script = util.format('<script>%s</script></head>', file);
} catch (e) {
  throw new Error('script.js was not found');
}

exports.getBodyParts = function (conf) {
  return {
    heads: [
      new RoboHydraHeadFilesystem({
        mountPath: '/models/aircraft/aircraft',
        documentRoot: path.join(__dirname, 'aircraft')
      }),

      new RoboHydraHeadFilesystem({
          mountPath: 'backend/aircraft/repository/aircraft',
          documentRoot: path.join(__dirname, 'aircraft')
      }),

      new RoboHydraHeadFilter({
        path: '/geofs.php*',
        filter: function (buffer) {
          return buffer.toString().replace('</head>', script);
        }
      }),

      new RoboHydraHeadProxy({
        mountPath: '/',
        proxyTo: 'http://www.geo-fs.com/',
        setHostHeader: true
      })
    ]
  };
};

console.log('Please go to http://localhost:3000/geofs.php to start Geo-FS.');
console.log('To exit, press Ctrl+C or close this window.');
