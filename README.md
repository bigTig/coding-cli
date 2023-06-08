# 自定义个人脚手架，通过命令行的方式下载对应模版，简化开发流程。

## 安装

### 全局安装

$ npm install -g coding-cli

# or yarn

$ yarn global add coding-cli

### 借助 npx

创建模版
$ npx create coding-cli <name> [-t|--template]
示例
$ npx create coding-cli hello-word -template react-webpack-ts

## 使用

创建模版
$ coding-cli create <name> [-t|--template]
示例
$ coding-cli create hello-word -t react-webpack-ts
