import { createVercelApp } from '../src/vercel.mjs';

export default {
  async fetch(request){
    const url=new URL(request.url);
    if(url.pathname==='/api/index'){
      const route=url.searchParams.getAll('__path').at(-1)||'';
      url.searchParams.delete('__path');
      // The rewrite passes the original path as data, never as an external URL.
      url.pathname='/'+route.replace(/^\/+/, '');
      request=new Request(url,request);
    }
    return createVercelApp(process.env).fetch(request);
  }
};
