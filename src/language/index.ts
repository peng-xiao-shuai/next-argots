/* eslint-disable @typescript-eslint/ban-types */
// TODO Message type
import { createI18n } from 'vue-i18n' //引入vue-i18n组件
import common from '@/common'

const modules = (import.meta as any).globEager('./*')
const viewModules = (import.meta as any).globEager('../views/**/locales/*.ts')
const componentModules = (import.meta as any).globEager(
  '../components/**/locales/*.ts'
)
const utilsModules = (import.meta as any).globEager('../utils/locales/*.ts')

type Message = {
  [s: string]: object | undefined
}

export type Language = {
  'zh-TW': {}
  'zh-CN': {}
  'en-US': {}
  'ja-JP': {}
}
export function getLangAll(): Language {
  const message: Message = {}
  getLangFiles(modules, message)
  getLangFiles(viewModules, message)
  getLangFiles(componentModules, message)
  getLangFiles(utilsModules, message)
  console.log(message)

  return message as Language & { [s: string]: object }
}

type MList = {
  [s: string]: { default: { [s: string]: string } }
}
/**
 * 获取所有语言文件
 * @param {MList} mList
 */
function getLangFiles(mList: MList, msg: Message) {
  for (const path in mList) {
    if (/keys/.test(path)) {
      continue
    }

    if (mList[path].default) {
      // 判断是否中英混合文件
      if (/zh-and-en/.test(path)) {
        type LocaleObj = {
          [s: string]: any
        }

        const localeObj: LocaleObj = {
          'zh-CN': {},
          'en-US': {},
        }
        // 拆解
        for (const i in mList[path].default) {
          localeObj['zh-CN'][i] = mList[path].default[i]
          localeObj['en-US'][i] = i.replace(/\./g, ' ')
        }
        // 合并
        for (const i in localeObj) {
          if (msg[i]) {
            msg[i] = {
              ...msg[i],
              ...localeObj[i],
            }
          } else {
            msg[i] = localeObj[i]
          }
        }
      } else {
        //  获取文件名
        const lastIndex = path.lastIndexOf('/')
        const pathName = path.slice(lastIndex + 1, lastIndex + 6)

        if (msg[pathName]) {
          msg[pathName] = {
            ...msg[pathName],
            ...mList[path].default,
          }
        } else {
          msg[pathName] = mList[path].default
        }
      }
    }
  }
}

//注册i8n实例并引入语言文件
const i18n = createI18n({
  legacy: false,
  locale: common.settingData.locale,
  fallbackLocale: 'en-US', // set fallback locale
  messages: getLangAll(),
})

export default i18n //将i18n暴露出去，在main.js中引入挂载
