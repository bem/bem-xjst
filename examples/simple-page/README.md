# bem-xjst example: simple page

Simplest usage example of bem-xjst.

Install dependencies (bem-xjst):
```bash
npm install
```

Run example:
```bash
node index.js > index.html
```

The result is `index.html` file with markup of simple page on top of `data.js`.

Project structure:

 * index.js — entry point.
 * data.js — typical data from any API or your backend.
 * bemtree-templates.js — templates to convert JSON to BEMJSON.
 * bemhtml-templates.js — templates to convert BEMJSON to HTML.
