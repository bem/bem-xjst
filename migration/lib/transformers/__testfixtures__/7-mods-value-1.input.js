block('a').mod('m', 1).content()('number');
block('a')(
      mod('m', 1).content()('number')
);

block('a').elem('e').elemMod('m', 1).content()('number');
block('a').elem('e')(
      elemMod('m', 1).content()('number')
);
block('a')(
      elem('e').elemMod('m', 1).content()('number')
);
