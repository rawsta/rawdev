---
title: Blog
description: 'Artikel zu Sachen, die mich interessieren.'
layout: blog
pagination:
  data: collections.AllPosts
  size: 6
permalink: 'blog/{% if pagination.pageNumber >=1  %}page-{{ pagination.pageNumber + 1 }}/{% endif %}index.html'
---

Von Zeit zu Zeit verfasse ich Artikel zu Themen, die mich interessieren oder einfach um Zusammenhänge besser zu verstehen. <small>Bei Fehlern oder Ideen, sagt mir auf [Github](https://github.com/rawsta/rawdev)bescheid.</small>

---

Aktuell gibt es {{ collections.posts.length }} Artikel in der Sammlung.