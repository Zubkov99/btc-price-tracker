import { PinoLogger } from 'nestjs-pino';

export function LockJob(): MethodDecorator {
  return function (target, propertyKey, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value as (...args: any[]) => Promise<any>;

    if (typeof originalMethod !== 'function') {
      throw new Error('@LockJob can only be applied to methods');
    }

    let isLocked = false;

    descriptor.value = async function (...args: any[]) {
      const logger: PinoLogger = this.logger;
      if (isLocked) {
        if (logger) {
          logger.warn(`[LockJob]: Skipping execution of ${String(propertyKey)} because it is already running`);
        }
        return;
      }

      isLocked = true;

      try {
        await originalMethod.apply(this, args);
      } finally {
        isLocked = false;
      }
    };

    return descriptor;
  };
}
