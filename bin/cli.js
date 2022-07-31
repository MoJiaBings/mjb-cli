#! /usr/bin/env node
const program = require('commander');

program
  // 定义命令和参数
  .command('create <app-name>')
  .description('创建一个新项目')
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option('-f, --force', '如果目标目录存在，则覆盖它')
  .action((name, options) => {
    require('../lib/create.js')(name, options)
})

program
   // 配置版本号信息
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')
  
// 解析用户执行命令传入参数
program.parse(process.argv);














