### BEM-XJST online demo
https://bem.github.io/bem-xjst/

#### Установка
```bash
git clone https://github.com/bem/bem-xjst --depth=1 -b gh-pages
cd bem-xjst
npm install
```

#### Development
Исходным файлом является — `desktop.bundles/index/index.bemjson.js`.

Чтобы поменять стандартные значения для BEMHTML и BEMJSON нужно поменять файлы `default_bemhtml.js`, `default_bemjson.js` в корне проекта. По умолчанию, любые изменения редактора записываются в *localStorage*. Для инвалидации кэша необходимо инкрементировать версию в `jsParams` блока `demo`.

```bash
npm start
open localhost:8080
```

#### Production
```bash
npm run build
open index.html
```