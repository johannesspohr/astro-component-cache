import { AstroComponentInstance } from "astro/server/render/astro/instance.js";
import { Cache } from "./Cache.js";
import { AsyncIteratorInterceptor } from "./AsyncIteratorInterceptor.js";
import { hashCode } from "./hash.js";

const cache = new Cache();

const renderContent = AstroComponentInstance.prototype.render;

AstroComponentInstance.prototype.render = async function* () {
  const cacheControl = this.factory.cacheControl;
  // TODO: Don't cache when slots are used
  if (this.factory.moduleId && cacheControl) {
    const { moduleId, buildId } = this.factory.moduleId;
    const propsHash = hashCode(JSON.stringify(this.props));
    const cacheId = `${moduleId}$$${buildId}$$${propsHash}`;

    const cacheEntry = cache.get(cacheId);
    if (cacheEntry) {
      yield* await cacheEntry;
    } else {
      let resolveCacheValue;
      const resultPromise = new Promise(
        (resolve) => (resolveCacheValue = resolve)
      );
      cache.set(cacheId, resultPromise, cacheControl.ttl ?? 3600);
      yield* new AsyncIteratorInterceptor(
        renderContent.call(this),
        resolveCacheValue
      );
    }
  } else {
    yield* renderContent.call(this);
  }
};
