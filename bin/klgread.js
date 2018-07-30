#!/usr/bin/env node

const program = require('commander');
const reader = require('../lib/reader');

program
  .usage('<file>')
  .command('*')
  .action(function (file, cmd) {
    reader(file).catch(err => {
      console.error('error ocurred! \n' + err.stack);
    });
  });

program
  .version('1.0.2')
  .parse(process.argv);

