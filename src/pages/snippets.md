---
title: Snippets
description: 'Artikel zu Sachen, die mich interessieren.'
layout: snippets
pagination:
  data: collections.snippets
  size: 6
permalink: 'snippets/{% if pagination.pageNumber >=1  %}page-{{ pagination.pageNumber + 1 }}/{% endif %}index.html'
---

Kleine, praktische Snippets, die ich immer wieder gerne verwende. <small>Bei Fehlern oder Ideen, sagt mir auf [Github](https://github.com/rawsta/rawdev)bescheid.</small>

---

Aktuell gibt es {{ collections.snippets.length }} Snippets in der Sammlung.