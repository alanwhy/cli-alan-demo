const path = require("path")
const fs = require("fs")
const Inquirer = require("inquirer")
const del = require("del")

const existDir = async (projectName) => {
  const dir = path.resolve(".")
  const createDir = dir + "/" + projectName
  if (fs.existsSync(createDir)) {
    const result = await Inquirer.prompt({
      name: "create dir",
      type: "confirm",
      message: "Overwrite your existed Directory?",
      default: true
    })
    if (result) {
      await del(createDir, { force: true })
      fs.mkdirSync(createDir)
      return createDir
    } else {
      console.log("取消了创建目录，停止创建项目！");
      process.exit(1)
    }
  }
  fs.mkdirSync(createDir)
  return createDir
}

module.exports = async (projectName) => {
  // console.log(projectName);
  // 1. 创建项目目录 如果存在 提示是否覆盖
  const dest = await existDir(projectName)
  // 2. 拉取github template 选择指定的tag与仓库
  console.log(dest);
  // 3. 下载并安装
}