#!/usr/bin/env node
const fs = require('fs-extra');
const program = require('commander');
const { buy } = require('./transactions');

// Init program
program
    .version('0.0.1')
    .description('Manage your crypto currency portfolio from terminal.');

// Register init command
program
    .command('buy')
    .description('Buy a coin')
    .action( () => {
        buy();
    });


// Parse arguments
program.parse(process.argv);