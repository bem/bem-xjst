block('b')
  .elem('*').match(function() {
    return this.elem !== 'name' && this.elem !== 'url';
  })
  .tag()('li');
