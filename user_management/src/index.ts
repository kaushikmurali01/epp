// import path from 'path';
// import dotenv from 'dotenv';

var path = require('path');
var dotenv = require('dotenv');

const envFilePath1 = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envFilePath1 });
console.log(process.env.PGHOST);