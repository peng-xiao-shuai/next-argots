import mitt from 'mitt'
import type { Emitter, EventType, Handler } from 'mitt'
type Events = Record<EventType, unknown>
// 初始化一个 mitt 实例
const emitter: Emitter<Events> & {
  once<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void
} = {
  ...mitt(),
  once(type, handler) {
    const wrappedHandler = () => {
      handler({})
      emitter.off(type, wrappedHandler)
    }
    emitter.on(type, wrappedHandler)
  },
}
// 最终是暴露自己定义的 emitter
export default emitter
