---
title: Blog
description: 'Artikel zu Sachen, die mich interessieren.'
layout: blog
pagination:
  data: collections.posts
  size: 6
permalink: 'blog/{% if pagination.pageNumber >=1  %}page-{{ pagination.pageNumber + 1 }}/{% endif %}index.html'
---

### Aktuell gibt es {{ collections.posts.length }} Artikel in der Sammlung.