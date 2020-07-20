const { program } = require("commander")
const { version } = require("../package.json")
const path = require("path")

// 查看版本
program.version(version)

const mapAcitons = {
  init: {
    alias: "i",
    desc: "create/init a project",
    examples: [
      "alan init <projectName>",
      "alan i <projectName>"
    ]
  },
  remove: {
    alias: "rm",
    desc: "remove files from path",
    examples: [
      "alan rm -r <filepath>",
      "alan rm <file>"
    ]
  },
  '*': {
    alias: "",
    desc: "command not found!",
    examples: []
  }
}

Object.keys(mapAcitons).forEach(key => {
  program.command(key).alias(mapAcitons[key].alias).description(mapAcitons[key].desc).action(() => {
    if (key == "*") {
      console.log(mapAcitons[key].desc);
    } else {
      require(path.resolve(__dirname, `./actions/${key}`))(
        ...process.argv.splice(3)
      );
    }
  })
})

program.parse(process.argv)