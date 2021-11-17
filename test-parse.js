const YAML = require('yaml')
const fs = require('fs')

const file = fs.readFileSync('./cred.yaml', 'utf8')
var json = YAML.parse(file)
console.log(json);