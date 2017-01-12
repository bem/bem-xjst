block('table').mod('theme', 'grey')(
  elem('cell').elemMod('type', 'head').def()(function() {
    var defaultStyles = {
      width: 'width: 180px;',
      color: 'color: #605d5d;'
    };

    var defaultStylesConcated = '';
    Object.keys(defaultStyles).map(function() {
        defaultStylesConcated = defaultStylesConcated + defaultStyles[style];
      return applyNext();
    });

    var style = defaultStylesConcated + (this.ctx.style || '');

    return applyNext({
      'ctx.style': style
    });
  })
);
