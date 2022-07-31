const { getTagList } = require('./http') //请求分支版本
const ora = require('ora') //命令行loading样式
const inquirer = require('inquirer') //询问用户选择

const util = require('util')
const path = require('path')
const downloadGitRepo = require('download-git-repo') // 不支持 Promise

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
    // 使用 ora 初始化，传入提示信息 message
    const spinner = ora(message);
    // 开始加载动画
    spinner.start();
  
    try {
      // 执行传入方法 fn
      const result = await fn(...args);
      // 状态为修改为成功
      spinner.succeed();
      return result; 
    } catch (error) {
      // 状态为修改为失败
      spinner.fail('请求失败，请重试 ...')
    } 
}


class Generator{

    constructor(name,targetDir){
        // 目录名称
        this.name = name;
        // 创建位置
        this.targetDir = targetDir;

        // 对 download-git-repo 进行 promise 化改造
        this.downloadGitRepo = util.promisify(downloadGitRepo);
    }

    // 1）从远程拉取版本数据
    // 2）用户选择模板名称
    // 3）return 用户选择版本

    async getTags() {
        // 1）从远程拉取模板数据
        const tagsList = await wrapLoading(getTagList, '等待选择版本');

        if (!tagsList) return;

        // 过滤我们需要的模板名称
        const tags = tagsList.map(item => item.name);
    
        // 2）用户选择自己新下载的模板名称
        const { tag }  = await inquirer.prompt({
          name: 'tag',
          type: 'list',
          choices: tags,
          message: '请选择创建项目的版本'
        })

        // 3）return 用户选择的版本
        return tag;
    }


    // 下载远程模板
    // 1）拼接下载地址
    // 2）调用下载方法
    async download(tag){

        // 1）拼接下载地址
        const requestUrl = `MoJiaBings/my-webpack-temp${tag?'#'+tag:''}`;

        // 2）调用下载方法
        await wrapLoading(
        this.downloadGitRepo, // 远程下载方法
        '等待下载模板中', // 加载提示信息
        requestUrl, // 参数1: 下载地址
        path.resolve(process.cwd(), this.targetDir)) // 参数2: 创建位置
    }

    // 核心创建逻辑
    async create(){
        // 1）获取版本名称
        const tag = await this.getTags()
        
        await this.download(tag);
    }

}
module.exports = Generator;




























