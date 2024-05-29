---
title: 'Code Blocks'
permalink: 'code-blocks'
description: 'Syntax Highlighting mit PrismJS. Noch nicht pperfekt aber ein Anfang zum aufbauen.'
date: 2022-06-08
tags: ['sytnax highlighting', 'feature']
---

Diese Seite nutzt 11ty's [Syntax Highlighting Plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/), welches wiederum PrismJS integriert. Alle highlight Umwandlungen passieren während des Build prozesses.

Dieser Artikel dient primär dazu das Syntax Highlighting zu testen und mich auf ein Design festzulegen.

```js
const cards = [...document.querySelectorAll( '.card' )];
cards.forEach(card => {
  card.style.cursor = 'pointer';
  let down,
    up,
    link = card.querySelector('a');
  card.onmousedown = () => (down = +new Date());
  card.onmouseup = () => {
    up = +new Date();
    if (up - down < 200) {
      link.click();
    }
  };
});

// JS © Heydon Pickering
```

```css
.smol-container {
  width: min(100% - 3rem, var(--container-max, 60ch));
  margin-inline: auto;
}

/* CSS © Stephanie Eckles, https://smolcss.dev/ */
```
