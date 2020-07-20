const path = require("path")
const fs = require("fs")
const Inquirer = require("inquirer")
const del = require("del")
const axios = require("axios")
const { promisify } = require("util")
// 方便使用async await
const downloadGitRepo = promisify(require("download-git-repo"))
// 主要用于拷贝文件
const ncp = promisify(require("ncp"))
// 执行shell脚本
const shelljs = require("shelljs")
const ora = require("ora")

const baseUrl = "https://api.github.com"

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

const fetchRepoList = async () => {
  const { data } = await axios.get(baseUrl + "/users/toimc/repos")
  const repoName = data.map(item => item.name).filter(item => /template/.test(item))
  return repoName
}

const fetchRepoTags = async (repo) => {
  const { data } = await axios.get(baseUrl + `/repos/toimc/${repo}/tags`)
  const tagName = data.map(item => item.name)
  return tagName
}

const waitLoading = (fn, message) => async (...args) => {
  const spinner = ora(message)
  spinner.start()
  const result = await fn(...args)
  spinner.succeed()
  return result
}

module.exports = async (projectName) => {
  // console.log(projectName);
  // 1. 创建项目目录 如果存在 提示是否覆盖
  const dest = await existDir(projectName)
  // 2. 拉取github template 选择指定的tag与仓库
  // console.log(dest);
  const repos = await waitLoading(fetchRepoList, "获取远程仓库列表...")()
  const { repo } = await Inquirer.prompt({
    name: "repo",
    type: "list",
    message: "Choose the repo needs to download?",
    choices: repos
  })
  // console.log(repoName);
  const tags = await waitLoading(fetchRepoTags, "获取远程仓库标签...")(repo)
  const { tag } = await Inquirer.prompt({
    name: "tag",
    type: "list",
    message: "Choose the tag needs to download?",
    choices: tags
  })
  // 3. 下载并安装
  let repoUrl = `toimc/${repo}`
  if (tag) {
    repoUrl = `toimc/${repo}#${tag}`
  }
  // console.log(repoUrl);
  await waitLoading(downloadGitRepo, "下载远程仓库中...")(repoUrl, dest + '/tmp')
  // console.log(result);
  // consolidate + ejs + ncp
  await ncp(dest + "/tmp", dest)
  await del(dest + "/tmp")
  // shelljs.cd(dest)
  // shelljs.exec("npm install")
}