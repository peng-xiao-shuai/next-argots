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

**English** | [简体中文](./README-zh.md)

## `Argot` 🕶️

- 🔒 Session information encryption
- 👥 No user data is collected
- 🏠 Channel sharing function
- 🥰 Emotional expression support
- 💥 Chat closed to destroy data
- 🌎 The network is reconnected and records are synchronized

### introduce

`next-argots` is a timely solution for individuals who prioritize confidentiality in the exchange of information on the network. It innovatively integrates strong encryption mechanisms to ensure that every communication on its platform is confidential and inaccessible to third parties, including server administrators and potential eavesdroppers. Unlike many platforms that store user data indefinitely, `next-argots` ensures that no conversation logs or personal information are kept beyond the duration of a chat session. And **no personal information is collected**.

### Payload CMS Url

```
https://argots.cn/admin
```

### major dispositions

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

### prerequisites

Before you start installing and running your project, make sure your system meets the following requirements:

- Operating system: Compatible with `Windows, Mac OS` or `Linux`
- Node.js: You can download it from [nodejs.org](https://nodejs.org/). I used `18.19.0`
- configuration: Open the '.env 'file after cloning is complete and configure all environment variables

### Installation dependency

```bash
yarn install
```

### package.json Project

```bash
yarn dev # project run
yarn build # project forming
yarn start # project startup
yarn generate:types # Generated set type
yarn generate:sitemap # Generated Google SiteMap
yarn lint # project observation
```

## How to Contribute

Welcome to join us! Ask an `Issue` or submit a `Pull Request`.

Pull Request:

1. Fork code!
2. Create your own branch: `git checkout -b feat/xxxx`
3. Submit your changes: `git commit -am 'feat: add xxxxx'`
4. Push your branch: `git push origin feat/xxxx`
5. submit `pull request`

## Git Contribution submission specification

reference specification ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

- `feat` Add new features
- `fix` Fix the problem/BUG
- `style` The code style is related and does not affect the running result
- `perf` Optimization/performance improvement
- `refactor` Refactor
- `revert` Undo edit
- `test` Test related
- `docs` Documentation/notes
- `chore` Dependency update/scaffolding configuration modification etc.
- `workflow` Workflow improvements
- `ci` Continuous integration
- `types` Type definition file changes
- `wip` In development

## plan （2024-3-30）

- [x] Determine network status and browser compatibility
- [x] Channel sharing function, and no authorization to enter the chat room page need to prompt (chat room address with parameters more parameter judgment to join the channel, etc.)
- [x] emo expression
- [x] Send a message scroll to the bottom
- [x] select an avatar
- [x] The network is reconnected and records are synchronized
- [x] Edit, reply to a chat record for all people, delete, copy (one/more) chat records
- [x] Cache static files using service workers

**Other functions can be `issues` propose**

## contribute

If you think this project helped you, please help click `Star`
