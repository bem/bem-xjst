block('b').mix()(['abs', 'abc']);
block('b').elem('e').mix()(['test']);
block('b').mod('mn', 'mv').elem('e').mix()(['test']);
block('b')(
  mix()([0,1,2])
);

block('b')(
  mix()(function() { return []; })
);

block('b')(
  content()([])
);
