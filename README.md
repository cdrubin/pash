# pashjs

./qjs --std templet.mjs examples/numbers.templet.txt
./qjs --std templet.mjs examples/numbers.templet.txt --intermediate


---

still need to work on the idea of a CMS as dir in Cloudflare Pages

functions /
  _content /
    schemas /
      blog.mjs : 
        JSON schema of what JSON objects should be

 which creates a UI for entry of blog posts and these are saved to KV during
 progress and periodically saved to 'history' branch of repo so that 
 when creating site the static site generator (perhaps pashjs) reaches out
 to the functions/_content/blogs.json feed for data that is used to create 
 the site pages
