import { d as defineEventHandler, b as getRequestURL } from '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'node:url';
import 'ipx';

const _fallback = defineEventHandler((event) => {
  const url = getRequestURL(event);
  const path = url.pathname;
  if (path.startsWith("/api/")) {
    return;
  }
  if ((path.match(/^\/wiki\/[^\/]+$/) || path.match(/^\/registry\/[^\/]+$/)) && !path.includes(".")) {
    return;
  }
  return;
});

export { _fallback as default };
//# sourceMappingURL=_fallback.mjs.map
