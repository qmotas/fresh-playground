import { Handlers } from '$fresh/server.ts';
import { CSS } from 'gfm/mod.ts';

export const handler: Handlers = {
  GET: () => {
    return new Response(CSS, {
      headers: {
        'content-type': 'text/css',
        'cache-control': 'public, max-age=31536000, immutable',
      },
    });
  },
};
