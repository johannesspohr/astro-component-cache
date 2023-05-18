# Astro Component Cache

> **Warning**
> This is just an experiment so far. Please don't use it in production.

With this integration, the output of components can be cached across requests.
This is configured by a simple export from the component file.

```
---
export const cache = { ttl: 3600 };
---
```

## How does it work?

A vite plugin scans all `.astro` files for exports named `cache`. Matching statements will be removed, and the value
will be attached to the component factory. A script will then be injected, that decorates the `render()` method of the
`AstroComponentInstance`, to check the cache first for components with the cache annotation. The cache key consists of
all passed props (hashed) and a build ID to clear the cache for HMR. If an entry is found in the cache, it will be returned.
Otherwise, the original render method will be called through a proxy that puts the results in the cache when finished.
