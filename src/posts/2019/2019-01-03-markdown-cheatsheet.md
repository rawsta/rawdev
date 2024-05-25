---
title: "Markdown Cheatsheet"
description: 'Kleines Markdown Cheatsheet, für die Seite.'
#cover: /assets/markdown-title.jpg
#category: cheatsheet
date: 2019-01-03
#template: post
#slug: markdown-cheatsheet
#tags:
#    - markdown
#    - large
---

# Markdown Cheatsheet

Diese Seite ist ein Cheatsheet und eine Vorschau für Markdown auf dieser Seite. Grob angelehnt an die [Github-flavored Markdown Info Seite](http://github.github.com/github-flavored-markdown/).

Wer es ganz genau haben möchte, kann sich auch [John Gruber's Original Spezifikationen](http://daringfireball.net/projects/markdown/) durchlesen.

## Another one...?

Warum noch ein Cheatsheet? <br>
[Es](http://github.github.com/github-flavored-markdown/) [gibt](https://www.markdownguide.org/cheat-sheet/) [bereits](https://github.com/im-luka/markdown-cheatsheet) [unzählige](http://mdcheatsheet.com), [umfangreichere](https://markdown.land/markdown-cheat-sheet) [Cheatsheets](http://mdcheatsheet.com).

Dieses Cheatsheet ist speziell auf diese Seite zu geschnitten. Gerade die Einbindungen von z.B. [YouTube Videos](#videos) sind hier etwas anders. 

##### Table of Contents

 - [Überschriften](#headlines)
 - [Emphasis](#emphasis)
 - [Listen](#listen)
 - [Links](#links)
 - [Bilder](#bilder)
 - [Code und Syntax Highlighting](#code)
 - [Tabellen](#tabellen)
 - [Blockquotes](#blockquotes)
 - [Inline HTML](#html)
 - [Horizontal Rule](#hr)
 - [Zeilenumbrüche](#linebreaks)
 - [YouTube Videos](#videos)

<a name="headlines"/>

## Überschriften

```no-highlight
# H1
## H2
### H3
#### H4
##### H5
###### H6

Alternativ für H1 und H2:

Alt-H1
======

Alt-H2
------
```

# H1
## H2
### H3
#### H4
##### H5
###### H6

Alternativ für H1 und H2:

Alt-H1
======

Alt-H2
------

## Foldable text:

<details>
  <summary>Title 1</summary>
  <p>Content 1 Content 1 Content 1 Content 1 Content 1</p>
</details>
<details>
  <summary>Title 2</summary>
  <p>Content 2 Content 2 Content 2 Content 2 Content 2</p>
</details>

    Markup : <details>
               <summary>Title 1</summary>
               <p>Content 1 Content 1 Content 1 Content 1 Content 1</p>
             </details>

<a name="emphasis"/>

## Emphasis

```no-highlight
Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~
```

Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~


<a name="listen"/>

## Listen

```no-highlight
1. First ordered list item
2. Another item
  * Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
  1. Ordered sub-list
4. And another item.

   Some text that should be aligned with the above item.

* Unordered list can use asterisks
- Or minuses
+ Or pluses
```

1.  First ordered list item
2.  Another item

   *  Unordered sub-list.

1.   Actual numbers don't matter, just that it's a number

   1.  Ordered sub-list

4. And another item.

    Some text that should be aligned with the above item.

*   Unordered list can use asterisks
-   Or minuses
+   Or pluses

- [ ] An uncompleted task
- [x] A completed task

```no-highlight
 - [ ] An uncompleted task
 - [x] A completed task
```
```no-highlight
- [ ] An uncompleted task
    - [ ] A subtask
```
 - [ ] An uncompleted task
    - [ ] A subtask




<a name="links"/>

## Links

Es gibt mehrere Arten um Links zu erstellen.

```no-highlight
[Ich bin ein inline-style link](https://www.duckduckgo.de)

[Ich bin ein referenz-style link][Arbitrary case-insensitive reference text]

[Es gehen auch einfach Zahlen für referenz-style link definitionen][1]

Oder komplett einfach und [verlinke den Text].

URLs und URLs in spitzen Klammern wird automatisch in Links umgewandelt.
http://www.beispiel.de or <http://www.beispiel.de> und manchmal auch
beispiel.de __(aber nicht auf Github)__.

Und hier etwas Text, um deutlich zu machen, dass Fußnoten und Referenzen erst später zugeordnet werden.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: https://heise.de
[verlinke den Text]: http://www.reddit.com
```

[Ich bin ein inline-style link](https://www.duckduckgo.de)

[Ich bin ein referenz-style link][Arbitrary case-insensitive reference text]

[Es gehen auch einfach Zahlen für referenz-style link definitionen][1]

Oder komplett einfach und [verlinke den Text].

URLs und URLs in spitzen Klammern wird automatisch in Links umgewandelt.
http://www.beispiel.de or <http://www.beispiel.de> und manchmal auch
beispiel.de __(aber nicht auf Github)__.

Und hier etwas Text, um deutlich zu machen, dass Fußnoten und Referenzen erst später zugeordnet werden.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: https://heise.de
[verlinke den Text]: http://www.reddit.com


<a name="bilder"/>

## Bilder

```no-highlight
Hier ist ein Logo __(hover, um den title zu sehen)__:

Inline-style:
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/bilder/icon48.png "Logo Title Text 1")

Reference-style:
![alt text][logo]

[logo]: https://github.com/adam-p/markdown-here/raw/master/src/common/bilder/icon48.png "Logo Title Text 2"
```

Hier ist ein Logo __(hover, um den title zu sehen)__:

Inline-style:
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/bilder/icon48.png "Logo Title Text 1")

Reference-style:
![alt text][logo]

[logo]: https://github.com/adam-p/markdown-here/raw/master/src/common/bilder/icon48.png "Logo Title Text 2"



<a name="code"/>

## Code und Syntax Highlighting

Code blocks are part of the Markdown spec, but syntax highlighting isn't. However, many renderers -- like Github's and *Markdown Here* -- support syntax highlighting. *Markdown Here* supports highlighting for dozens of languages (and not-really-languages, like diffs and HTTP überschriften); to see the complete list, and how to write the language names, see the [highlight.js demo page](http://softwaremaniacs.org/media/soft/highlight/test.html).

```no-highlight
Inline `code` has `back-ticks around` it.
```

Inline `code` has `back-ticks around` it.

Blocks of code are either fenced by lines with three back-ticks <code>```</code>, or are indented with four spaces. I recommend only using the fenced code blocks -- they're easier and only they support syntax highlighting.

<pre lang="no-highlight"><code>
```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```

```python
s = "Python syntax highlighting"
print s
```

```
No language indicated, so no syntax highlighting.
But let's throw in a &lt;b&gt;tag&lt;/b&gt;.
```
</code></pre>



```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```

```python
s = "Python syntax highlighting"
print s
```

```
No language indicated, so no syntax highlighting in Markdown Here (varies on Github).
But let's throw in a <b>tag</b>.
```

Für eine umfangreichere Übersicht er unterstüzten Sprachen, besuche die [highlight.js Demoseite](http://softwaremaniacs.org/media/soft/highlight/test.html).



## Hotkeys

<kbd>⌘F</kbd>

<kbd>⇧⌘F</kbd>

    Markup : <kbd>⌘F</kbd>


### Hotkey list:

| Key | Symbol |
| --- | --- |
| Option | ⌥ |
| Control | ⌃ |
| Command | ⌘ |
| Shift | ⇧ |
| Caps Lock | ⇪ |
| Tab | ⇥ |
| Esc | ⎋ |
| Power | ⌽ |
| Return | ↩ |
| Delete | ⌫ |
| Up | ↑ |
| Down | ↓ |
| Left | ← |
| Right | → |



## Emojis

:exclamation: Emoji icons können auch einfach eingefügt werden. :+1:  weitere Codes auf [emoji-cheat-sheet.com](http://emoji-cheat-sheet.com/)

    Markup : Code appears between colons :EMOJICODE:



<a name="tabellen"/>

## Tabellen

Tabellen sind zwar nicht Bestandteil der Markdown spec, aber die meisten Renderer unterstützen diese. 

```no-highlight
Doppelpunkte werden für die Ausrichtung der Tabelle benutzt.

| Tabellen      | Sind          | Cool    |
| ------------- | :-----------: | ----:   |
| col 3 ist     | right-aligned | 1.600 € |
| col 2 ist     | zentriert     | 12 €    |
| zebra stripes | are neat      | 1 €     |

Die äußeren __"Pipes"__ <kbd>|</kbd> sind optional und müssen auch nicht unbedingt ausgerichtet sein.

| | Markdown | Less           | Pretty     |     |
| | ------------- | --------------- | ---------- |------- |
| | *Still*   | `renders` | **nicely** | |
| | 1               | 2                 | 3          |          |
```

Doppelpunkte werden für die Ausrichtung der Tabelle benutzt.

| Tabellen      | Sind          | Cool    |
| ------------- | :-----------: | ----:   |
| col 3 ist     | right-aligned | 1.600 € |
| col 2 ist     | zentriert     | 12 €    |
| zebra stripes | are neat      | 1 €     |

Die äußeren __"Pipes"__ <kbd>|</kbd> sind optional und müssen auch nicht unbedingt ausgerichtet sein.

| | Markdown | Less           | Pretty     |     |
| | ------------- | --------------- | ---------- |------- |
| | *Still*   | `renders` | **nicely** | |
| | 1               | 2                 | 3          |          |




<a name="blockquotes"/>

## Blockquotes

```no-highlight
> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.
```

> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.

```no-highlight
> Blockquote
>> Verschachtelte Blockquote
```
> Blockquote
>> Verschachtelte Blockquote


<a name="html"/>

## Inline HTML

Man kann auch einfach direkt HTML innerhalb von Markdown benutzen.

```no-highlight
<dl>
  <dt>Definition list</dt>
  <dd>Is something people use sometimes.</dd>

  <dt>Markdown in HTML</dt>
  <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
</dl>
```

<dl>
  <dt>Definition list</dt>
  <dd>Is something people use sometimes.</dd>

  <dt>Markdown in HTML</dt>
  <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
</dl>



<a name="hr"/>

## Horizontal Rule

```
Drei oder mehr...

---

Bindestriche

***

Asterisks

___

Unterstriche
```

Drei oder mehr...

---

Bindestriche

***

Asterisks

___

Unterstriche



<a name="linebreaks"/>

## Zeilenumbrüche

My basic recommendation for learning how line breaks work is to experiment and discover -- hit <kbd>Enter</kbd> once (i.e., insert one newline), then hit it twice (i.e., insert two newlines), see what happens. You'll soon learn to get what you want. "Markdown Toggle" is your friend.

Here are some things to try out:

```
Here's a line for us to start with.

This line is separated from the one above by two newlines, so it will be a *separate paragraph*.

This line is also a separate paragraph, but...
This line is only separated by a single newline, so it's a separate line in the *same paragraph*.
```

Here's a line for us to start with.

This line is separated from the one above by two newlines, so it will be a *separate paragraph*.

This line is also begins a separate paragraph, but...
This line is only separated by a single newline, so it's a separate line in the *same paragraph*.

(Technical note: *Markdown Here* uses GFM line breaks, so there's no need to use MD's two-space line breaks.)



<a name="videos"/>

## YouTube Videos

They can't be added directly but you can add an image with a link to the video like this:

```no-highlight
<a href="http://www.youtube.com/watch?feature=player_embedded&v=8AkLfYOgIrE
" target="_blank"><img src="http://img.youtube.com/vi/8AkLfYOgIrE/0.jpg"
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>
```

Or, in pure Markdown, but losing the image sizing and border:

```no-highlight
[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](http://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_HERE)
```
