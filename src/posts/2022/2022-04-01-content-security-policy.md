---
title: 'Content-Security-Policy'
permanlink: /blog/content-security-policy.html
description: 'Eine Content-Security-Policy ist ein Weg um größere Kontrolle über Skripte und Stile der eigenen Seite zu haben.'
date: 2022-04-01
tags: ['Security', 'CSP', 'XSS']
---

Wenn Browser Code __(JS,etc)__ ausführen, erzwingen sie die Einhaltung der `Same-Origin-Policy`. Dies bedeutet, dass Code von einer Quelle nicht auf Inhalte einer anderen Quelle zugreifen darf.
In der Praxis sind jedoch **Cross-Site-Scripting (XSS)** Schwachstellen sehr verbreitet, wodurch die `Same-Origin-Policy` ausgehebelt wird.

Ein Haupt-Pattern bei XSS-Angriffen ist das Einschleusen von Inline-Skripten in den HTML-Code, der dann bei jedem Request mit ausgeliefert und ausgeführt wird.

Aus Sicht des Browsers kommt dieser untergeschobene Code aus der gleichen Quelle wie die angegriffene Webseite.
Die **Content-Security-Policy** erzwingt daher eine strikte Trennung  zwischen HTML und externen Dateien mit JavaScript.

## Grundlegendes zu den Inhalts-Sicherheits-Richtlinien

Eine Content-Security-Policy ist ein Sicherheitskonzept, um _Cross-Site-Scripting (XSS)_ und andere Angriffe durch Einschleusen von Daten in Webseiten zu verhindern.

Aktuell am weitesten verbreitet ist [CSP Level 1](https://caniuse.com/#feat=contentsecuritypolicy2) aber auch [CSP Level 2 wird gut unterstützt](https://caniuse.com/#feat=contentsecuritypolicy2), wobei sich die CSP Level 3 noch im Status [W3C Working Draft](https://www.w3.org/TR/CSP/) befindet und wird speziell um HTML5-relevante Features wie etwa Web-Sockets ergänzt.

Der offizielle Name des HTTP-Header-Felds ist `Content-Security-Policy`.

Die *<abbr title="Content Security Policy">CSP</abbr>* verfolgt das Konzept, Javascript nur dann auszuführen, wenn es sich in
einer `.js` Datei befindet. Selbstverständlich ist der Browser des Nutzers
selbst für die Einhaltung der CSP zuständig, sodass der Schutz auf Clientseite erfolgt -- Inline-Scripts werden also trotz _"verseuchtem"_ HTML nicht ausgeführt, wenn der Browser des Nutzers CSP unterstützt.

Hierzu müssen evtl. einige Anpassungen durchgeführt werden:

```html
<a id="kontaktFormular" onclick="foo()">Foo</a>
```

*...wird dann zu...*

```HTML
<script src="script.js"></script>
<a id="kontaktFormular">Foo</a>
```

*...und in der script.js:*

``` js
$(document).ready(function() {
    $("#kontaktFormular").on("click", function() {
        foo();
    });
});
```

Alternativ sind `addEventListener()` gut geeignet um solche Events abzufangen. Die CSP
beschränkt sich nicht auf die Deaktivierung von Inline-Skripten.

Es können konkrete Regeln definiert werden, von wo Bilder, JS- und CSS-Dateien geladen werden dürfen. Es lassen sich natürlich auch für jede Regeln Ausnahmen definieren.

Für einige Regeln wie z.B. die Behandlung von Javascript ist noch zusätzlich festgelegt, dass zum Beispiel `eval()` nicht mehr ausgeführt wird. Wenn es unbedingt sein muss, kann es auch wieder erlaubt werden.
Weiterhin unterstützt die CSP ein Reporting-Verfahren: Bei jedem festgestellten Verstoß gegen die Policy wird ein POST-Request vom Browser des Nutzers an eine vorher definierte
URL gesendet.

Mehr zum Reporting unten

## Einbindung der CSP

Die CSP sollte optimalerweise als HTTP-Header übermittelt werden. Der Header sieht im aktuellen Status der Policy wie folgt aus:

Der finale Header
: `Content-Security-Policy: <CSP-Regeln hier>`

Internet-Explorer 10+11
: `X-Content-Security-Policy: <CSP-Regeln hier>` **(deprecated)**

**Hinweis!:** Wenn man `Content-Security-Policy:` und gleichzeitig `X-Content-Security-Policy` angegeben hat, kann es zu unverhersehbaren Verhalten kommen.

*Es wird empfohlen komplett auf die `X-*` zu verzichten.*

Bei einem **Apache** reicht es schon, diese Zeile in die `httpd.conf`, den `VHost` oder in die `.htaccess` zu schreiben.

```Apache
Header set Content-Security-Policy "default-src 'self';"
```

Für **Nginx** muss in der Config der `server{}` block erweitert werden:

```Nginx
add_header Content-Security-Policy "default-src 'self';";
```

---

Falls man für eine Seite eine gesonderte CSP haben möchte, kann man auch ein **Meta-Tag** setzen.

```html
<meta http-equiv="Content-Security-Policy" content="default-src https://cdn.example.net; child-src 'none'; object-src 'none'">
```

Das hat allerdings keine Auswirkung auf `frame-ancestors`, `report-uri` der `sandbox`. Für diese müssen die Direktiven gesondert gesetzt werden.

---

### Was per default nicht erlaubt ist

Wenn der `Content-Security-Policy` header in der Antwort vom Server steht, wird alles was nicht explizit freigegeben wurde, geblockt.
Ein Ziel von solchen Richtlinien ist eine striktere Ausführung von JavaScript um bestimmte XSS Angriffe abzuwehren. Im Allgemeinen bedeutet es das einige Features per *"default"* nicht verfügbar sind:

**Inline JavaScript code**
 - `<script>` Blöcke
 - DOM event handler als HTML attribute(e.g. `onclick`)
 - `javascript:` links

**Inline CSS statements**
 - `<style>` block in HTML elementen


**Dynamische JS Code evaluation**
 - `eval()`
 - string arguments für `setTimeout` und `setInterval`
 - `new Function()` constructor


**Dynamische CSS statements**
- [CSSStyleSheet.insertRule()](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule) methode

Auch wenn der Einsatz von CSPs in einer neuen Anwendung erstmal relativ einfach ist, besonders aus CSP-kompatiblen JS-frameworks[^5] bestehende Apps benötigen evtl. etwas Refactoring oder eine Lockerung der CSP.

Empfohlene *"coding practice"* für CSP-kompatible Apps ist es, Code aus externen Dateien zu laden.

```html
<script src="snippet.js">
```
[JSON parsen](https://caniuse.com/#feat=json) anstatt es zu evaluieren und [EventTarget.addEventListener()](https://developer.mozilla.org/de/docs/Web/API/EventTaret/addEventListener)
event handler zu setzen.

<!-- **Fußnoten**

<references>

[^6] [^7] [^8] [^9]

</references> -->

## Reporting

Es wird empfohlen, die CSP zunächst mit der Anweisung `Content-Security-Policy-Report-Only` zu
testen, bevor die Policy live geschaltet wird. Der Browser erhält dabei die ganzen Richtlinien, jedoch anstatt diese anzuwenden wird in der Console ausgegeben, was für Auswirkungen die CSP haben könnte.

Jedesmal wenn eine angeforderte Ressource oder Skript unsere Richtlinien verletzt, feuert der Browser ein POST request an die angegebene `report-uri` mit den Details zum Verstoß und kann dort dann verarbeitet werden *(Mailversand, Logdatei, Datenbank,etc...)*

Dafür wird im Header anstatt `Content-Security-Policy:` einfach `Content-Security-Policy-Report-Only:` gesendet.

Es ist auch machbar, eine CSP im Einsatz zu haben, aber mit einer anderen zu experimentieren.

Beispiel:
``` PHP
    header("Content-Security-Policy: script-src 'self' 'unsafe-inline'; report-uri /aktiveMeldungen.php");
    header("Content-Security-Policy-Report-Only: script-src 'self'; report-uri /versuchsMeldungen.php");
```

Der Report wird als JSON Objekt ausgegeben:

```json
{
  "csp-report": {
    "document-uri": "http://example.org/page.html",
    "referrer": "http://evil.example.com/",
    "blocked-uri": "http://evil.example.com/evil.js",
    "violated-directive": "script-src 'self' https://apis.google.com",
    "original-policy": "script-src 'self' https://apis.google.com; report-uri http://example.org/my_amazing_csp_report_parser"
  }
}
```

**Hinweis!** `report-uri (uri);` ist in CSP 3 deprecated und wird durch `report-to (token)` ersetzt.

## Direktiven der CSP

Momentan gibt es [ca. 30 mögliche Angaben](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#Directives) mit schwankender Unterstützung.

Hier findet Ihr eine Übersicht über die relevantesten Angaben.

default-src
: Bestimmt für alle Ressourcen einen Default-Wert, die nicht explizit
    aufgeführt wurden. *(bspw: `script-src` geht vor `default-src`)*

script-src
: Bestimmt, von welchen Domains externe Scripts geladen werden dürfen und ob Inline-Scripte (`'unsafe-inline'`) erlaubt sind. Weiterhin kann hier eval (`'unsafe-eval'`) wieder erlaubt werden.

object-src
: Bestimmt, von welchen Domains Flash und andere Plugins *(Silverlight,etc)* geladen werden
    -- Gilt für die Tags `<object>` ,`<embed>` und `<applet>`

style-src
: Bestimmt, von welchen Domains CSS-Dateien geladen werden dürfen.

img-src
: Bestimmt, von welchen Domains Bilder geladen werden dürfen.
 *Gilt nicht nur für den `<img>`-Tag sondern auch für CSS-Background-Images*.

media-src
: Bestimmt, von welchen Domains `<video>` und `<audio>` Elemente geladen werden.

*frame-src (deprecated in CSP2 / undeprecated in CSP3)*
: Bestimmt, welche Seiten per Frame eingebunden werden dürfen. `child-src` wird in CSP2 bevorzugt.

child-src
: Bestimmt, von welchen Domains aus WebWorker und verschachtelte Inhalte geladen werden. Betrifft `<frame>` und `<iframe>`

frame-ancestors
: Bestimmt, von welchen Domains Elemente wie `<frame>`, `<iframe>`, `<object>`, `<embed>`, `<applet>` eingebettet werden dürfen. Kann nicht per Meta-Tag eingebunden werden.

font-src
: Bestimmt, von welchen Domains externe Schriftarten mit der @font-face-Direktive geladen werden dürfen. *(z.B. fonts.google.com)*

form-action
: Bestimmt, von welchen Domains `<form>` actions erlaubt sind.

connect-src
: Bestimmt, zu welchen Seiten eine Verbindung per WebSocket, XHR, EventSource und Fetch erlaubt wird.

manifest-src
: Bestimmt, von wo ein Manifest geladen werden kann.

report-uri *(deprecated CSP 3)*
: URL an die die Verstöße gemeldet werden

report-to
: Gruppe (definiert im Report-To-Header) an die, die Verstöße gemeldet werden

plugin-types
: Bestimmt, welche MIME-typen als Plugin ausgeführt werden dürfen. bspw. per `<object>`  oder `<embed>`

sandbox
: Ermöglicht eine Sandbox für die angeforderte Ressource. Die Sandbox hat eine *same-origin-policy* und fast alles ist erstmal blockiert.
    Die Seite wird behandelt als wenn sie in einem iframe geladen wird.
: angaben dazu:
`allow-forms, allow-same-origin allow-scripts allow-popups, allow-modals, allow-orientation-lock, allow-pointer-lock, allow-presentation, allow-popups-to-escape-sandbox, allow-top-navigation`


require-sri-for
: Subresource Integrity (SRI) Ist ein Sicherheitsfeature mit dem der Browser die Integrität der Ressourcen verifizieren kann, um eine Manipulation auszuschließen.

```html
<script src="https://code.jquery.com/jquery-3.1.1.slim.js"
        integrity="sha256-5i/mQ300M779N2OVDrl16lbohwXNUdzL/R2aVUXyXWA="
        crossorigin="anonymous">
</script>
```
Ressourcen ohne einen Integrity-Hash werden nicht geladen.

---

Bei Problemen mit **Mixed-Content** kann man diese Quellen auch *"upgraden"*

`Content-Security-Policy: upgrade-insecure-requests;` wandelt alle `http://` anfragen in `https://` um.

Als Gegenstück dazu gibt es auch: `block-all-mixed-content` um alle unsicheren Elemente zu blockieren.

---

### Mögliche Angaben zur Quelle

Für alle Direktiven die auf `-src` enden, stehen eine Reihe von Werten
zu Verfügung. Mehrere Werte werden einfach mit Leerzeichen getrennt.
*(nur bei `'none'` macht das keinen sinn)*

`*`
: Wildcard womit jede URL als Quelle erlaubt ist. (ausgenommen sind `data:`, `blob:`, `filesystem:` und `schemes:`)

`'none'`
: Das Gegenstück. Jede URL wird blockiert. *(Falls JS o.ä. gar nicht benötigt wird)*

`'self'`
: Erlaubt nur vom gleichen Ursprung *(gleiches Protokoll, Host, Port)*

`data:`
: Erlaubt Inhalte per `data-...` Schema zu laden *(z.B. Base64 encoded Icons)*

`sub.domain.tld`
: Erlaubt genau diese eine Subdomain als Quelle

`*.domain.tld`
: Erlaubt jede Subdomain als Quelle *(gilt nicht für https://domain.tld)*

`https://domain.tld`
: Erlaubt nur Domains über https und müssen damit anfangen

`https:`
: Erlaubt nur über https aber von jeder Domain

`'unsafe-inline'`
: Erlaubt die unsicheren Inline-Skripte/-Styles, onclick-events, etc. *(je nach Kontext)*

`'unsafe-eval'`
: Erlaubt unsichere dynamische Code Evaluation z.B. mit `eval()`

`'nonce-...'`
: Erlaubt `<script>` oder `<style>` tags inline ausgeführt zu werden wenn der `nonce` übereinstimmt.

`'sha256-'`
: Erlaubt ganze statische Blöcke inline auszuführen wenn der Hash übereinstimmt.

---

### Hashes & Nonces

Um einzelne Inline-skripte doch zu erlauben, ohne direkt alles zu erlauben *(was gegen den Sinn einer CSP geht)*, kann man einen Hash angeben.

Wenn man eine CSP  aktiv hat und versucht Inline Code auszuführen , meldet die Konsole direkt die Fehler an.

```
 Refused to execute inline script because it violates the following Content Security Policy: "default-src 'self'". Either the ''unsafe-inline'' keyword, a hash('sha256-sdfjkhfdkjPsdfdfPsddsP'), or nonce … is required to enable inline execution.
```

Um diesen Scriptblock zu zulassen, kann man den sha256-hash aus der
Fehlermeldung kopieren und in die CSP einfügen.

`Content-Security-Policy: default-src 'self'; script-src 'sha256-sdfjkhfdkjPsdfdfPsddsP'`

Der Hash des Script-Blocks bleibt immer gleich und mit der Codezeile wird erklärt, dass exakt diesem Script immer vertraut wird. Dieses Skript wird ausgeführt, alle anderen nicht.

Damit kann man sich gut eine kleine Whitelist an erlaubten Skriptblöcken
erstellen.

**Hinweis!! Wird der Block verändert, ändert sich auch dementsprechend der Hash!**

---

Da diese Hashes statisch sind, benutzt man für dynamisch generierte Blöcke einfach `nonce` *(number used once)*. Während die Hashes nur einzelne spezielle Skripte erlauben, kann man mit Nonces ganze Skript Blöcke, unabhängig vom Inhalt, freigeben.

In der CSP steht: `script-src 'nonce-2726c7f26c'`

Inline steht:

```html
<script nonce="2726c7f26c">
    alert("It just works!");
</script>
```

Streng genommen ist der nonce keine "random"-zahl [sondern ein base64 wert](https://www.w3.org/TR/CSP2/#nonce_value)

`* base64-value = 1*( ALPHA / DIGIT / "+" / "/" )*2( "=" )`
`* nonce-value  = base64-value`
`* nonce-source = "'nonce-" nonce-value "'"`

---

### CSP Standardverhalten

Standardmäßig verhält sich die CSP so, als wäre `default-src: '*'` eingestellt. Alle Ressourcen dürfen von überall geladen werden.
Das ist nicht besonders sicher, unterbindet aber die Ausführung von **Inline CSS, Inline Script** und **eval()** - wenn man dies nicht explizit erlaubt.
Durch **default-src** wird für alle Ressourcen ein Standard angegeben, die nicht gesondert in der
CSP
aufgeführt sind.

## Beispiele

Ein einfaches Beispiel könnte so ungefähr aussehen:

```php
Content-Security-Policy: default-src 'self' cdn.foobar.de; script-src 'self' code.jquery.com; style-src 'self' fonts.googleapis.com;
```

**Erklärung der Angaben:**
Alle Ressourcen dürfen standardmäßig von der eigenen Domain ('self') und von cdn.foobar.de geladen werden.

: **Wichtig:** 'self' steht in Hochkommas, weil es ein Keyword ist.
    Sonst würde *self* als Domain interpretiert werden.
: Dabei ist das Keyword 'self' streng mit der genauen Domain. Befindet sich eure Seite unter `beispiel.geocities.com` und 'self' ist als Ressource gewhitelisted, darf nicht von `woanders.geocities.com` geladen werden.
: Umgekehrt: Wenn die Domain `geocities.com` ist und 'self' ist eingestellt, darf von `script.geocities.com` nicht geladen werden. Dies muss explizit mit angegeben werden.

- Scripte dürfen nur von der eigenen Domain und `code.jquery.com` geladen werden.

: **NICHT** von `cdn.foobar.de`, denn default-src wird für Scripts überschrieben, sobald 'script-src' explizit angegeben ist.
: Die Ausführung von Inline-Scripten ist nicht gestattet, `eval()` wird auch nicht erlaubt.

- Stylesheets dürfen von der eigenen Domain und von `fonts.googleapis.com` geladen werden.

: Inline-Styles sind so noch nicht möglich.

---

Falls es nicht möglich ist, alles korrekt abzusichern und auf inline-skripte und inline-styles zu verzichten, lässt sich *wenigstens* eine Einschränkung auf HTTPS setzen.

Beispiel SSL-only:

```
Content-Security-Policy: default-src https:; script-src https: 'unsafe-inline'; style-src https: 'unsafe-inline'
```

---

## CSP und Google Analytics, Fonts, etc.

### Google Analytics
Für Google Analytics wird empfohlen einfach die Inline-Skripte in eigene
Dateien auszulagern und diese einzubinden.

Google Analytics versucht auf 3 Arten die Daten zu Google zu schaffen:

- Image Request
- Post Request
- Browser "Beacon"

Die Bildanfrage fangen wir mit: `img-src www.google-analytics.com` ab.

Die beiden anderen Anfragen fangen wir ab mit: `connect-src www.google-analytics.com`

Analytics sollte man natürlich auch in der `script-src` hinzufügen.

### Google Tag Manager

Leider ist die Hauptaufgabe des Tag Manager Skripte in die Seite zu injecten. Deshalb muss man die CSP etwas freier auslegen und für den GTM freigeben.

```js
script-src: https://www.googletagmanager.com 'unsafe-inline';
```

Um die Benutzerdefinierten JS Variablen zu nutzen, muss man auch zusätzlich `'unsafe-eval'` angeben. Selbstverständlich muss man auch die Quellen freigeben, die durch den GTM geladen
werden. *(z.B. Analytics)*

Um den Debug-Modus vom GTM zu nutzen, müssen weitere Angaben gemacht werden.
`script-src: tagmanager.google.com ;`

`style-src: tagmanager.google.com 'unsafe-inline';`

Es kann sein, das evtl noch Grafiken/Icons vom GTM geblockt werden, hat aber keinen funktionellen Einfluss.

### Google Fonts
Für Google Fonts muss die `font-src` und `style-src` gesetzt werden. Mit den richtigen Domains ist das recht einfach.

### YouTube
Da YouTube als `<frame>`  embedded wird, reicht hier eine Angabe in der `child-src`.

Zusammengefasst sind das hier die benötigten Regeln:

```
script-src: 'unsafe-eval' 'unsafe-inline' https://tagmanager.google.com/ https://www.googletagmanager.com/ https://www.google-analytics.com stats.g.doubleclick.net;
style-src 'unsafe-inline' [https://tagmanager.google.com/](https://tagmanager.google.com/)https://fonts.googleapis.com ;
img-src 'unsafe-inline' https://ssl.gstatic.com/ https://www.google-analytics.com stats.g.doubleclick.net;
connect-src www.google-analytics.com;
font-src https://fonts.gstatic.com;
child-src www.youtube.com;
```

## CSP und Typo3

Da die Arbeit mit dem Web und besonders Typo3 es erfordert, das es Inline Skripte und Styles gibt, muss dafür die CSP etwas angepasst werden.

Hier eine Beispielkonfiguration von JWeiland:

```
Content-Security-Policy: default-src 'unsafe-inline' 'unsafe-eval';
script-src 'unsafe-inline' 'unsafe-eval' https://jweiland.net https://stat.jweiland.net https://www.googletagmanager.com https://www.google-analytics.com;
font-src 'self';
style-src 'unsafe-inline' https://jweiland.net/;
img-src 'self' https://www.google-analytics.com/ https://stats.g.doubleclick.net/ https://stat.jweiland.net;
frame-src https://player.vimeo.com/;
connect-src https://jweiland.net/
```

Und wie bei Typo3 üblich, kann natürlich alles auch einfach per
Typoscript setzen.

```
 config.additionalHeaders {
   10.header = strict-transport-security:max-age=31536000
   20.header = X-Frame-Options:SAMEORIGIN
   30.header = X-Xss-Protection: 1; mode=block
   40.header = X-Content-Type-Options: nosniff
   50.header = Referrer-Policy:strict-origin
   60.header =  Content-Security-Policy: default-src 'self'  https://www.google-analytics.com; font-src 'self' fonts.gstatic.com; script-src 'unsafe-inline' 'unsafe-eval' 'self' https://code.jquery.com https://www.google-analytics.com stats.g.doubleclick.net; img-src 'self' 'unsafe-inline' data: https://ssl.gstatic.com/ https://www.google-analytics.com stats.g.doubleclick.net;
   style-src 'self' 'unsafe-inline'  fonts.googleapis.com; connect-src www.google-analytics.com 'self';
 }
```

---

Es gibt auch eine Extension im [Typo3-Repo](https://extensions.typo3.org/extension/csp/) und
[Github](https://github.com/OttoAndras/typo3-csp/) für v7 und v8 *(letztes Update: 22. Jan 2018)*
Ab der aktuellen v12.4 ist das CSPP-Modul bereits integriert.

## CSP generieren

Abgesehen von der manuellen Arbeit und dem herantasten an eine funktionierende CSP, kann man diese Arbeiten auch automatisieren.
Mit [Fiddler](https://www.telerik.com/fiddler) und der [CSP Extension](https://github.com/david-risney/CSP-Fiddler-Extension) kann man gut eine CSP erstellen.
Das Tool setzt einfach eine `Content-Security-Policy-Report-Only` und generiert anhand der Fehlermeldungen eine möglichst restriktive CSP.

Sowohl [Fiddler](https://www.telerik.com/fiddler) und die [CSP Extension](https://github.com/david-risney/CSP-Fiddler-Extension) sind frei verfügbar.

## Weitere relevante Header

Neben der `Content-Security-Policy` gibt es auch noch weitere Header, die durchaus relevant sind und die Sicherheit erhöhen können.
Diese Header versuchen Bereiche abzudecken, die nicht in die CSP gehören oder diese zu ergänzen

### HTTP Strict Transport Security (HSTS)

HTTP Strict Transport Security (HSTS) ist ein "web security policy mechanism" welcher hilft Webseiten gegen **[Protocol Downgrade attacken](https://www.praetorian.com/blog/man-in-the-middle-tls-ssl-protocol-downgrade-attack?edition=2019)** und **[Cookie Hijacking](https://medium.com/bugbountywriteup/when-cookie-hijacking-html-injection-become-dangerous-3c649f7f6c88)** zu schützen. Dadurch sagt der Server dem Client, dass er alle Verbindungen nur über HTTPS aufbaut. Der Server setzt die HSTS policy um, in dem er den Header (Strict-Transport-Security) über eine HTTPS Verbindung sendet *(HSTS headers über HTTP werden ignoriert)*.

Beispiel:
`Strict-Transport-Security: max-age=31536000 ; includeSubDomains`

Parameter:
- max-age=SECONDS
    - Wie lange der Browser sich merken soll, das diese Seite nur über HTTPS erreichbar ist
- includeSubDomains
    - Optional. Gibt an, dass diese Regeln auch für SubDomains gilt.

### X-Frame-Options

X-Frame-Options response header verbessert den Schutz vor **Clickjacking**. Damit kann dem Client gesagt werden, ob Daten während der Übertragung in fremden Frames angezeigt werden darf.

Parameter:
- deny
    - Kein rendern im frame
- sameorigin
    - Kein Rendern wenn der origin nicht stimmt
- allow-from: DOMAIN
    - Rendern erlaubt wenn frame innerhalb von DOMAIN geladen wird.

### X-XSS-Protection

Mit diesem Header wird ein *Cross-Site-Scripting (XSS)* filter im Browser aktiviert.

Parameter:
- 0
: Filter deaktiviert

- 1
: Filter aktivert, bei XSS Attacke wird der Browser die Seite "sanitizen"

- 1; mode=block
: Filter aktviert, bei XSS Attacke wird der Browser die Seite komplett blocken anstatt nur "sanitizen"

### X-Content-Type-Options

Durch diesen Header wird der Browser abgehalten Dateien als etwas anderes, als im Content-Type deklarierten, zu interpretieren. Es gibt nur ein Parameter dafür: `nosniff`.

### [Referrer Policy](https://www.w3.org/TR/referrer-policy/)

Dieser Header regelt, welche Referrer-Informationen, die im Referrer-Header gesendet wurden, in Anfragen aufgenommen werden sollen. Es gibt relativ viele verschiedene Optionen, die man hierbei setzen kann. Neben Firefox unterstützen zwar auch Chrome und Opera diesen Typ bereits, allerdings noch nicht alle der möglichen Optionen.

Parameter:

- no-referrer
: Es wird kein Referrer übergeben
- no-referrer-when-downgrade
: Kein Referrer wenn wechsel von https auf http
- same-origin
: nur senden wenn gleiche domain
- origin
: Ursprung wird immer mitgesendet
- strict-origin
: wird immer mitgesendet wenn https
- origin-when-cross-origin
:
- strict-origin-when-cross-origin
:
- unsafe-url
:
- " " *(empty string)*
:fallback auf no-referrer-when-downgrade

### X-Powered-By

Der `X-Powered-By Header` gibt im Regelfall die verwendete PHP-Version aus und kann es zusammen
mit dem Server-Header einem Angreifer leichter machen.
Durch `unset` wird die Ausgabe der Informationen unterdrückt.

### Expect-CT

Browser sollen Verbindungen auf [Certificate Transparency](https://www.certificate-transparency.org/) prüfen. *(noch nicht gut supported)*

### Feature-Policy

[ermöglicht zugriff auf Features wie Gyroscope, Kamera, etc](https://wicg.github.io/feature-policy/) *(noch nicht gut supported)*

### X-Permitted-Cross-Domain-Policies

[spezifisch für Adobe Produkte mit Bezug auf Cross Domain Requests](https://www.adobe.com/devnet-docs/acrobatetk/tools/AppSec/xdomain.html)
*(support unbekannt)*

## CSP für Drittanbieter

Hier findet Ihr eine kleine Übersicht über die meisten Anbieter und welche Regeln nötig sind, für den Betrieb:

**Google Analytics**

`script-src 'unsafe-inline' www.google-analytics.com stats.g.doubleclick.net [https://stats.g.doubleclick.net](https://stats.g.doubleclick.net)
`img-src www.google-analytics.com stats.g.doubleclick.net [https://stats.g.doubleclick.net](https://stats.g.doubleclick.net)
`connect-src www.google-analytics.com`

**Google Tag Manager**

`script-src 'unsafe-inline' www.googletagmanager.com; `
`img-src www.googletagmanager.com ;`

**Google Maps**

`script = maps.googleapis.com maps.gstatic.com`

**Google Fonts**

`style-src fonts.googleapis.com ;`
`font-src fonts.gstatic.com ;`

**YouTube**

`child-src www.youtube.com ;`

**Vimeo**

`default-src *.vimeo.com ;`
`script-src *.vimeo.com *.vimeocdn.com *.newrelic.com *.nr-data.net ;`
`style-src *.vimeocdn.com ;`
`child-src 'self' *.vimeo.com *.vimeocdn.com ;`
`connect-src *.vimeo.com ;`

**jQuery Google**

`style-src ajax.googleapis.com ;`

**jQuery CDN**

`script-src code.jquery.com ;`
`style-src code.jquery.com ;`

**jQuery CDN + jquery UI**

`script-src code.jquery.com ;`
`style-src code.jquery.com ;`
`img-src code.jquery.com ;`

**ColorBox**

`style-src 'unsafe-inline';`

**TypeKit**

`style-src use.typekit.net ;`
`style-src use.typekit.net ;`
`font-src use.typekit.net fonts.typekit.net ;`
`img-src p.typekit.net ;`

**TypeKitPerformance**

`connect-src performance.typekit.net`

**Bootstrap**

`style-src code.jquery.com cdnjs.cloudflare.com maxcdn.bootstrapcdn.com`
`style-src maxcdn.bootstrapcdn.com`

## Tipps & Hinweise

**Allgemeines**

- Alle Direktiven müssen in derselben Zeile notiert werden (keine Zeilenumbrüche erlaubt). Sie werden jeweils durch Semikolon getrennt.
- Eine Direktive kann eine Liste mehrerer Werte enthalten. Die Werte werden durch ein Leerzeichen getrennt. Einzige Ausnahme: falls der Wert 'none' verwendet wird, sollte kein weiterer Wert folgen.
- Einige Werte werden in einfache Anführungszeichen gesetzt, z.B. `unsafe-inline` und `nonce-123456`. Du findest die korrekte Schreibweise stets bei [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).
- Host- und Schema-Quellen (wie etwa www.example.org) werden nicht in Anführungszeichen gesetzt.

**Wildcards**
: Bei Wildcards bzw. Platzhaltern muss man vorsichtig sein.
: `*://*.trisinus.de:*` trifft auf alle sub-domains und alle ports zu.
    Jedoch NICHT `trisinus.de`. Es muss dann mindestens www. mit angegeben werden.

**Doppelte Angaben**
: Doppelte angaben wie z.B.
    `Content-Security-Policy: script-src remondis.de; script-src google.de`
    sind nicht erlaubt. bzw werden ignoriert. In diesem Beispiel würde
    nichts von Google geladen werden.
: Mehrere Domains gibt man einfach Leerzeichen getrennt an:
    `Content-Security-Policy: script-src remondis.de google.de;`

**Inline eval()**
: Um Daten zu parsen, sollte man lieber die `JSON.parse` Funktion
    benutzen.

**setTimeout, setIntervall**
: einfach die function in eine anonyme funktion setzen:

Inline Event Handler wie `onclick`, `onerror` und ähnliche Inline Elemente.

```html
<script> function doThings() { ... } </script>
<span onclick="doThings();">A thing.</span>
```

wandeln wir um in

```html
<span id="things">A thing.</span>
<script nonce="${nonce}">
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('things')
          .addEventListener('click', function doThings() { ... });
});
</script>
```

javascript-links umwandeln
: links auf JS-Funktionen sind nicht erlaubt.

```html
 <a href="javascript:linkClicked()">foo</a>
```

```html
<a id="foo">foo</a>
<script nonce="${nonce}">
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('foo')
          .addEventListener('click', linkClicked);
});
</script>
```

## Links & Infos

- [Content-Security-Policy.com](https://content-security-policy.com/)
- [CSP BrowserTest](https://content-security-policy.com/browser-test/)
- [Google Web Fundamentals - CSP](https://developers.google.com/web/fundamentals/security/csp/)
- [MDN Mozilla](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- [CSP Playground](https://cspplayground.com/)
    - [CSP Validator](https://cspplayground.com/csp_validator)
- [CSP Generator](https://www.cspisawesome.com/)
- [CSP Tools](https://report-uri.com/home/tools)
- [CSP Introduction](https://scotthelme.co.uk/content-security-policy-an-introduction/)
- [CSP.withGoogle.com](https://csp.withgoogle.com/docs/index.html)

- [W3C CSP Level 1](https://www.w3.org/TR/CSP1/) *(stand: 19.02.2015)*
- [W3C CSP Level 2](https://www.w3.org/TR/CSP2/) *(stand: 15.12.2016)*
- [W3C CSP Level 3](https://www.w3.org/TR/CSP3/) *(stand: 15.10.2018)*

*Alle Security Header prüfen*

- [SecurityHeaders.com](https://securityheaders.com/)

*weitere Tests*

- [WebSec Test](https://www.immuniweb.com/websec/)

[^1]:

[^2]:

[^3]:

[^4]:

[^5]:

[^6]: Das Verhalten kann global deaktiviert werden mit dem `'unsafe-inline'` statement.

[^7]: Vertrauten inline `<script>` und `<style>` Blöcken kann man individuell "whitelisten" in der CSP mit `nonce` oder `hash` statements.

[^8]: Das Verhalten kann global deaktiviert werden mit dem `'unsafe-eval'` statement.

[^9]: Zum Beispiel, AngularJS benötigt nur ein *initialization flag* gesetzt auf den CSP-kompatiblen modus.
