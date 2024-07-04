<p align="center">
  <a href="https://argots.cn/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://argots.cn/logo.svg" alt="Argots logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/next"><img src="https://img.shields.io/badge/next-%3E%3D14.2.2-black" alt="next"></a>
  <a href="https://nodejs.org/en/about/previous-releases"><img src="https://img.shields.io/badge/node-%3E%3D18.19.0-green" alt="node compatibility"></a>
	    <a href="https://element-plus.gitee.io/#/zh-CN/component/changelog" target="_blank">
	        <img src="https://img.shields.io/badge/daisyui-%3E2.3.0-%231ad1a5" alt="daisyui">
	    </a>
		<a href="https://www.tslang.cn/" target="_blank">
         <img src="https://img.shields.io/badge/typescript-%3E5-blue" alt="typescript">
	    </a>
		<a href="https://gitee.com/abc1612565136/vite-admin/blob/master/LICENSE" target="_blank">
		    <img src="https://img.shields.io/badge/LICENSE-MIT-success" alt="license">
		</a>
</p>
<br/>

[English](./README.md) | **简体中文**

## `Argot` 🕶️

- 🔒 对话信息加密
- 👥 不收集用户数据
- 🏠 房间共享功能
- 🥰 情绪表达式支持
- 💥 聊天关闭销毁数据
- 🌎 断网重连，并且同步数据

### 介绍

`next-argots` 是一个在网络信息交换中优先考虑机密性的个人提供了及时的解决方案。它创新地集成了强大的加密机制，以确保其平台上的每一条通信都是机密的，第三方（包括服务器管理员和潜在的窃听者）无法访问。与许多无限期存储用户数据的平台不同，`next-argots` 确保在聊天会话持续时间之外不会保留任何对话日志或个人信息。并且**无需收集任何个人信息**。

### Payload CMS Url

```
https://argots.cn/admin
```

### 主要配置

- [Next](https://nextjs.org/docs)
- [Trpc](https://trpc.io/docs/quickstart)
- [Payload CMS](https://payloadcms.com/)
- [Pusher](https://pusher.com/docs/channels/getting_started/javascript/?ref=docs-index)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Zod](https://zod.dev/)
- [Typescript](https://www.tslang.cn/docs/home.html)
- [I18next](https://www.i18next.com/)
- [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- [Crypto.js](https://cryptojs.gitbook.io/docs)
- [Daisyui](https://daisyui.com/)

### 先决条件

在开始安装并运行项目之前，请确保您的系统满足以下要求:

- 操作系统：兼容 `Windows、Mac OS` 或 `Linux`
- `Node.js`：您可以从 [nodejs.org](https://nodejs.org/) 下载它。我使用的是 `18.19.0`
- 配置：在克隆完成之后打开 `.env` 文件，并配置所有环境变量

### 安装依赖项

```bash
yarn install
```

### package.json 命令介绍

```bash
yarn dev # 项目运行
yarn build # 项目构建
yarn start # 项目启动
yarn generate:types # 生成集合类型
yarn generate:sitemap # 生成网站地图
yarn lint # 项目检查
```

### 如何贡献

非常欢迎你的加入！提一个 `Issue` 或者提交一个 `Pull Request`。

`Pull Request`:

1. `Fork` 代码!
2. 创建自己的分支: `git checkout -b feat/xxxx`
3. 提交你的修改: `git commit -am 'feat: add xxxxx'`
4. 推送您的分支: `git push origin feat/xxxx`
5. 提交 `pull request`

### Git 贡献提交规范

参考规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

- `feat` 添加新功能
- `fix` 修复问题/BUG
- `style` 代码风格相关，不影响运行结果
- `perf` 优化/性能提升
- `refactor` 重构
- `revert` 撤消 编辑
- `test` 测试相关
- `docs` 文档/注释
- `chore` 依赖更新/脚手架配置修改等。
- `workflow` 工作流程改进
- `ci` 持续集成
- `types` 类型定义文件更改
- `wip` 开发中

### 计划 （2024-3-30）

- [x] 判断网络状态以及浏览器兼容性
- [x] 频道分享功能，以及没有授权进入聊天室页面需要提示（聊天室地址携带参数时更具参数判断加入频道等）
- [x] emo 表情
- [x] 发消息滚动到底部
- [x] 选择头像
- [x] 断网重连，同步数据
- [x] 编辑、回复所有人某一条聊天记录，删除、复制(一条/多条)聊天记录

**其他功能可以在 `issues` 提出**

### 捐赠

如果你觉得这个项目帮助到了你，请帮助点击 `Star`
