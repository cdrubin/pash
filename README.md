# pash

`make build` (the default target) will do the following:

```
curl -L https://github.com/cdrubin/quickjs/releases/latest/download/qjs -o pash && chmod +x pash
curl -L https://cosmo.zip/pub/cosmos/bin/zip -o zip && chmod +x zip
zip pash .init.mjs pash.mjs marked.esm.js chromium-base64.js
(valid modification of APE zips requires: https://cosmo.zip/pub/cosmos/bin/zip)
```

## usage:

./pash [indir] [outdir]

The following is default behaviour:

- files and directory names that start with . or _ are ignored
- .md files are converted to .html
- including a templet inside another is done with ${ pash.include( filename ) }

---

still need to work on the idea of a CMS as dir in Cloudflare Pages

```
functions /
  _content /
    schemas /
      blog.mjs : 
        JSON schema of what JSON objects should be
```

 which creates a UI for entry of blog posts and these are saved to KV during
 progress and periodically saved to 'history' branch of repo so that 
 when creating site the static site generator (perhaps pashjs) reaches out
 to the functions/_content/blogs.json feed for data that is used to create 
 the site pages
