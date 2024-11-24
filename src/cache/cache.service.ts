import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService<T> {
  private cache: Map<string, T> = new Map();

  public set(key: string, value: T): void {
    this.cache.set(key, value);
  }

  public get(key: string): T | undefined {
    return this.cache.get(key);
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }
}
