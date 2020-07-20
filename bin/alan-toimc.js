#! /usr/bin/env node
// console.log("hello world! hello cli");

const { program } = require("commander")
const { version } = require("../package.json")
const del = require("del")
const path = require("path")

program.version(version)

const delFunc = async (name) => {
  const dir = path.resolve(".")
  await del(dir + "/" + name)
}

program
  .option('-c, --create', 'create a project')
  .option('-i, --init <type>', 'init a project with a name!')
  .option("-d, --delete <file>", "delete file", delFunc)

program
  .command('rm <dir>')
  .option('-r, --recursive', 'Remove recursively')
  .action(function (dir, cmdObj) {
    console.log('remove ' + dir + (cmdObj.recursive ? ' recursively' : ''))
  })

// program
//   .command('clone <source> [destination]')
//   .option("-i, --info", "clone info")
//   .description('clone a repository into a newly created directory')
//   .action((source, destination, obj) => {
//     console.log("obj", obj);
//     console.log("source" + source);
//     console.log("destination" + destination);
//     console.log('clone command called');
//   });

// console.log("process.argv", process.argv);
program.parse(process.argv)

// console.log(program.create);
// console.log(program.init);