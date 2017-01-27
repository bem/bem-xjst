block('b')
  .elemMatch(function() {
    return this.elem !== 'name' && this.elem !== 'url';
  })
  .tag()('li');
