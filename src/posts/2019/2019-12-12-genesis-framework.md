---
title: Das Genesis Framework
cover: /assets/windows-title.jpg
category: wordpress
date: 2019-12-12
template: post
slug: genesis-framework
tags:
    - wordpress
    - themes
---

# Genesis Framework

Genesis ist ein entwickler-freundliches Framework für die Entwicklung von WordPress Themes.

Es ist besonders bei Entwicklern beliebt, da es von Haus viele kleine Funktionen mitliefert die bei der Entwicklung helfen.<br>
Hilfreich sind besonders die [Hooks], [Filter] und die [Actions]

## Hooks, Actions und Filter

### Was sind Hooks

Man kann sich den Aufbau einer Seite/eines Themes wie den einer Karte vorstellen. Es gibt fast überall die gleichen Bereiche wie Header, Navigation, Seitenleiste, Footer, etc...<br>
Hooks findet man überall in WordPress und den Themes. Jedoch hat Genesis einen Haufen an durchdachten Hooks, die einem das Leben erleichtern.

Mit den Hooks kann man relativ einfach z.B. die sekundäre Navigation in den Footer verschieben, Neue Widgetbereiche hinzufügen oder auch die komplette Struktur ändern und vieles mehr.

Es gibt eine Vielzahl an möglichen Hooks womit man arbeiten kann. Für eine bessere Übersicht gibt es sowohl eine [Visual Hook Guide Webseite](https://genesistutorials.com/visual-hook-guide/) und ein Plugin mit dem gleichen Namen.

###  Actions zu den Hooks

Hooks werden mit Actions angesprochen.

Beispiel wo die sekundäre Navigation aus dem Standardort genommen wird und neu positioniert wird.
```php
 remove_action( 'genesis_after_header', 'genesis_do_subnav' );
 add_action( 'genesis_footer', 'genesis_do_subnav', 10 );

```

Wie man sieht ist die Benutzung relativ simpel. <br/>
`remove_action` entfernt `genesis_do_subnav` aus dem Hook `genesis_after_header` <br/>
und mit `add_action` wird `genesis_do_subnav` in den Hook `genesis_footer` gesetzt.

Die Zahl am Ende gibt die optionale Priorität an. Je niedriger die Zahl, desto früher wird die Funktion eingefügt.

###  Filter

_Mit Filtern kann man sachen filtern._

_Mehr infos folgen..._

