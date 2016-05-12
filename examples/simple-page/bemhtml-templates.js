module.exports = function() {
  // 1. Common HTML elements — doctype, html, head, meta, title, body
  block('page').wrap()(function() {
    var ctx = this.ctx;
    var data = ctx.data;

    return [
      '<!DOCTYPE html>',
      {
        tag: 'html',
        attrs: { lang: ctx.lang || 'en-US' },
        content: [
          {
            tag: 'head',
            content: [
              { tag: 'meta', attrs: { charset: 'utf-8' } },
              { tag: 'title', content: ctx.title }
            ]
          },
          {
            tag: 'body',
            content: ctx
          }
        ]
      }
    ];
  });

  // 2. User block — name, username, position
  block('user')(
    tag()('h1'),

    // Add to content username only if present
    match(function() { return this.ctx.username; })
    .content()(function() {
      return [ applyNext(), 'aka', this.ctx.username ].join(' ');
    }),

    // Add to content position only if present
    match(function() { return this.ctx.position; })
    .content()(function() {
      return [ applyNext(), this.ctx.position ].join(', ');
    })
  );

  // 3. User avatar
  block('avatar').replace()(function() {
    var avatar = this.ctx.avatar;
    return [
      {
        block: 'link',
        url: avatar.big.url,
        content: {
          block: 'image',
          url: this.ctx.avatar.small.url
        }
      },
      {
        block: 'para',
        content: 'Photo by ' + avatar.small.author
      }
    ];
  });

  block('image')(
    tag()('img'),
    attrs()(function() {
      return { src: this.ctx.url };
    })
  );

  // 4. List of links — service name, link
  block('links')(
    tag()('ul'),
    elem('item')(
      tag()('li'),
      content()(function() {
        return {
          block: 'link',
          url: this.ctx.url,
          content: applyNext()
        };
      })
    )
  );

  block('link')(
    tag()('span'),
    // Check if there is url field otherwise it’s a span element
    match(function() { return this.ctx.url; })(
      tag()('a'),
      attrs()(function() {
        return {
          href: this.ctx.url,
          target: '_blank'
        };
      }),

      // Check if there is no service name field in data
      // and try to render it from link
      match(function() { return !this.ctx.content; })
        .content()(function() {
          return this.ctx.url.replace(/^https?:\/\//, '');
        })
    )
  );
};
