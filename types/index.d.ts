export type IpAddress = string

declare module 'claude-code' {
  interface PluginState {
    orange: { ip: IpAddress }
  }
}
