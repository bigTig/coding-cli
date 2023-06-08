#!/usr/bin/env node
const program = require('commander')
const inquirer = require('inquirer')
const ora = require('ora') // 引入ora
const fs = require('fs-extra') // 引入fs-extra
const path = require('path')
const downloadGitRepo = require('download-git-repo')
const package = require('../package.json')
const templates = require('./templates.js')
// 新增
// const { getGitReposList } = require('./api.js')

// 定义当前版本
program.version(`v${package.version}`)
// 添加--help
program.on('--help', () => {})

program
  .command('create [projectName]')
  .description('创建模板')
  .option('-t, --template <template>', '模板名称')
  .action(async (projectName, options) => {
    // 添加获取模版列表接口和loading
    // const getRepoLoading = ora('获取模版列表...')
    // getRepoLoading.start()
    // const templates = await getGitReposList('bigTig')
    // getRepoLoading.succeed('获取模版列表成功!')

    // 1. 从模板列表中找到对应的模板
    let project = templates.find(
      (template) => template.name === options.template
    )
    // 2. 如果匹配到模板就赋值，没有匹配到就是undefined
    let projectTemplate = project ? project.value : undefined
    console.log('命令行参数：', projectName, projectTemplate)

    // 3. // 如果用户没有传入名称就交互式输入
    if (!projectName) {
      const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: '请输入项目名称：',
      })
      projectName = name // 赋值输入的项目名称
    }
    console.log('项目名称：', projectName)

    // 4. 如果用户没有传入模板就交互式输入
    if (!projectTemplate) {
      const { template } = await inquirer.prompt({
        type: 'list',
        name: 'template',
        message: '请选择模板：',
        choices: templates, // 模板列表
      })
      projectTemplate = template // 赋值选择的项目名称
    }
    console.log('模板：', projectTemplate)

    const dest = path.join(process.cwd(), projectName)
    // 判断文件夹是否存在，存在就交互询问用户是否覆盖
    if (fs.existsSync(dest)) {
      const { force } = await inquirer.prompt({
        type: 'confirm',
        name: 'force',
        message: '目录已存在，是否覆盖？',
      })
      // 如果覆盖就删除文件夹继续往下执行，否的话就退出进程
      force ? fs.removeSync(dest) : process.exit(1)
    }

    // 5. 开始下载模板
    const loading = ora('正在下载模板...')
    // 开始loading
    loading.start()
    downloadGitRepo(projectTemplate, dest, (err) => {
      if (err) {
        console.log('创建模板失败', err)
      } else {
        loading.succeed('创建模板成功!')
        // 添加引导信息(每个模版可能都不一样，要按照模版具体情况来)
        console.log('\n\n')
        loading.succeed(`cd ${projectName}`)
        loading.succeed('yarn')
        loading.succeed('yarn start\n')
      }
    })
  })

program.parse(process.argv)
