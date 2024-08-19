export default interface ICacheProvider {
  set(key: string, value: any, options: unknown): Promise<void>;
  get(key: string): Promise<any | undefined>;
}
