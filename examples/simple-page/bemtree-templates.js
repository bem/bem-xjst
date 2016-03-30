// This is BEMTREE template to convert regular data in JSON to
// BEMJSON (see https://github.com/bem/bem-xjst/blob/master/docs/en/4-data.md)
module.exports = function() {
  block('root').replace()(function() {
    // Save `data` in `this.data` for usage in other templates.
    var data = this.data = this.ctx.data;

    return {
      block: 'page',
      title: [ data.name.first, data.name.last, 'profile' ].join(' '),
      data: data
    };
  });

  block('page').content()(function() {
    var data = this.data;

    return [
      {
        block: 'user',
        content: [ data.name.first, data.name.last ].join(' '),
        username: data.username,
        position: data.position,
      },
      {
        block: 'avatar',
        avatar: data.avatar
      },
      {
        block: 'links',
        profiles: data.profiles
      }
    ];
  });

  block('links').content()(function() {
    return this.ctx.profiles.map(function(link) {
      return {
        elem: 'item',
        content: link.service,
        url: link.url
      };
    });
  });
};
