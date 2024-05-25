---
title: ServiceWorker und PWA
date: 2019-11-05
cover: /assets/serviceworker-title.jpg
category: javascript
template: post
slug: serviceworker-und-pwa
tags:
    - swjs
    - serviceworker
    - pwa
---

# ServiceWorker mit Workbox

----

**Hinweis:** Dieser Beitrag ist mehr als Platzhalter gedacht, bis ich den weiter ausarbeiten kann. Sorry!

----
<!--
##### Table of Contents
- [Funktionsweise](#funktionsweise)
- [Was ist ein ServiceWorker?](#was-ist-ein-serviceworker?)
- [skipWaiting() / clients.claim()](#skipwaiting--clientsclaim)
- [Registrierung / Status](#registrierung--status)
- [Fetch API](#fetch-api)
- [Headers](#headers)
- [Request](#request)
- [Response](#response)
- [Cache API](#cache-api)
- [Push API](#push-api)
- [IndexedDB API](#indexeddb-api)
- [Warum Workbox?](#warum-workbox)
- [Precaching](#precaching)
- [Runtime caching](#runtime-caching)
- [Die verschiedenen Strategien](#die-verschiedenen-strategien)
- [Workbox Plugins](#workbox-plugins)
- [Tipps und Tricks](#tipps-und-tricks)
-->

```toc
# Here comes the TOC
```

## Was ist ein ServiceWorker?
Technisch gesehen ist ein Service Worker ein spezieller Web Worker, bietet also eine Möglichkeit, JavaScript unabhängig vom Hauptthread auszuführen.

Die Besonderheit des [Service Workers](https://w3c.github.io/ServiceWorker/#service-worker-concept) besteht darin, dass er bestimmte Dienste für die ihm zugeordneten Seiten übernehmen kann und auch dann aktiv sein kann, wenn der Benutzer keine dieser Seiten aufgerufen hat. Service Worker sind die Ablösung/Ergänzung zu bekannten Arten wie dem HTTPcache des Browsers, ApplicationCache und weiteren.

Die neue [Service Worker-API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) erlaubt es JavaScript auch dann auszuführen, wenn die dazugehörige Website gar nicht geöffnet ist. Die Besonderheit des ServiceWorkers besteht darin, dass er bestimmte Dienste für die ihm zugeordneten Seiten übernehmen kann und auch dann aktiv sein kann, wenn der Benutzer keine dieser Seiten aufgerufen hat. Service Worker funktionieren wie Proxy-Server, was es unter anderem erlaubt, Netzwerkanfragen und -antworten zu modifizieren und mit Objekten aus dem Cache zu ersetzen.

Um einen Missbrauch als _Man-in-the-Middle_ zu verhindern, sind Service Worker nur innerhalb eines sicheren Kontexts erlaubt, also in der Regel nur über **HTTPS**. _(localhost ist für die Entwicklung die einzige Ausnahme)_

## Funktionsweise

Beim Initialisieren des Service Workers (dem einzigen Zeitpunkt, zu dem eine Internetverbindung notwendig ist) werden alle benötigten Ressourcen heruntergeladen und gespeichert.

Hierzu kann prinzipiell jeder verfügbare Speicher genutzt werden, etwa die [IndexedDB API](#indexeddb-api), in der Regel wird meistens eher die [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) bevorzugt da sie Ressourcen anhand ihrer URL speichern kann.

Anschließend muss der Service Worker nur auf `fetch()` Events reagieren. Dieses Event wird immer dann ausgelöst, wenn eine vom Service Worker überwachte Seite eine neue Ressource anfordert.
Dies kann durch die Navigation des Benutzers auftreten, dadurch, dass eine aufgerufene Seite weitere Elemente wie Bilder oder Stylesheets einbindet, oder weil mittels AJAX dynamisch Daten geladen werden sollen. Ist die angeforderte Ressource im Cache des Service Workers vorhanden, so kann er sie einfach übergeben, eine Internetverbindung ist nicht notwendig.

Eine einfache Umsetzung läuft ungefähr so ab:

1. Die URL des Service Workers wird aufgerufen und via `serviceWorkerContainer.register()` registriert.
1. War dies erfolgreich, wird der Service Worker im `ServiceWorkerGlobalScope` ausgeführt;
  1. Im Prinzip ist dies eine besondere Art von Worker-Kontext, welcher außerhalb des Threads des Hauptskriptes läuft und keinen Zugriff auf das DOM hat.
1. Der Service Worker kann nun Events verarbeiten.
1. Die Installation des Workers wird versucht, wenn Seiten, die durch Service Worker verwaltet werden, wiederholt besucht werden. Ein Install-Event ist immer das erste, welches an einen Service-Worker  gesendet wird _(Dies kann beispielsweise benutzt werden, um den Prozess zu starten, der die IndexedDB befüllt und Seiten-Assets cacht)_. Das ist der gleiche Ablauf, der bei der Installation einer nativen App stattfindet - alles für die Offline-Nutzung vorbereiten.
1. Sobald der `oninstall`-Handler abgeschlossen ist, wird der Service-Worker als installiert betrachtet.
1. Der nächste Schritt ist Aktivierung. Sobald der Service-Worker installiert wurde, erhält dieser ein `activate`-Event.
  1. Der Hauptnutzen von `onactivate` ist das Aufräumen von Ressourcen, die in vorherigen Versionen des Service Worker genutzt wurden.
1. Der Service Worker kann nun Webseiten verwalten, aber nur wenn diese nach dem erfolgreichen Abschluss von `register()` aufgerufen wurden.
  1. Ein Dokument, welches ohne Service Worker gestartet wurde bis zu einem Neuladen nicht von einem Service Worker verwaltet werden.


Eine beispielhafte Einbindung könnte so aussehen:
```js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceworker.js', {
        scope: './'
    }).then(function (registration) {
        var serviceWorker;
        if (registration.installing) {
            serviceWorker = registration.installing;
            document.querySelector('#kind').textContent = 'installing';
        } else if (registration.waiting) {
            serviceWorker = registration.waiting;
            document.querySelector('#kind').textContent = 'waiting';
        } else if (registration.active) {
            serviceWorker = registration.active;
            document.querySelector('#kind').textContent = 'active';
        }
        if (serviceWorker) {
            // logState(serviceWorker.state);
            serviceWorker.addEventListener('statechange', function (e) {
                // logState(e.target.state);
            });
        }
    }).catch (function (error) {
        // Da ist etwas schief gelaufen. Wahrscheinlich ist serviceworker.js nicht verfügbar oder hat einen Fehler.
    });
} else {
    // Der Browser unterstützt keine serviceWorker.
}
```

---


### skipWaiting() / clients.claim()

Es gibt die [`ServiceWorker.skipWaiting()`](https://w3c.github.io/ServiceWorker/#service-worker-global-scope-skipwaiting) methode, womit der neue Serviceworker direkt die Kontrolle über den Scope übernimmt. <br />
Dadurch wird nicht gewartet, bis der letzte Tab mit dem aktuellen SW geschlossen ist. Durch die Wartezeit soll vermieden werden das man in Tab A noch mit alten Daten surft und in Tab B mit den neuen Daten. Wenn man von Tab A die gleiche Seite wie in Tab B ansteuern will, ist nicht klar welcher SW jetzt verantwortlich ist.

`skipWaiting()` überspringt die Wartezeit bzw den _"waiting"_-status. Bei OnePagern/SPA kann das praktisch sein. Kann bei Mehrseitigen PWAs aber auch Probleme verursachen. <br/>
Wird meistens während des `install`-events zusammen mit `clients.claim()` eingesetzt.

Mit [`clients.claim()`](https://w3c.github.io/ServiceWorker/#clients-claim) wird der jeweilige SW direkt der "controller" für alle clients im scope. Dabei wird der `controllerchange`-event in _navigator.serviceWorker_ in allen Clients ausgelöst.

### Registrierung / Status

Beispiel einer erweiterten Registrierung und dem Eventlistener für `controllerchange`

```js
navigator.serviceWorker.register('/serviceworker.js').then(registration=> {
    registration.installing; // status: installing worker, oder undefined
    registration.waiting; // status: waiting worker, oder undefined
    registration.active; // status: active worker, oder undefined

    registration.addEventListener('updatefound', () => {
      // A wild serviceworker has appeared in reg.installing!
      const newWorker = registration.installing;

      newWorker.state;
      // "installing" - gerade am installieren
      // "installed"  - installation fertig
      // "activating" - gerade am aktivieren
      // "activated"  - voll aktiviert
      // "redundant"  - Redundant. Ein SW kontrolliert den Scope bereits

    newWorker.addEventListener('statechange', () => {
      // newWorker.state hat sich geändert
    });
  });
});

navigator.serviceWorker.addEventListener('controllerchange', () => {
  // Wenn ein neuer SW den Scope z.B. mit skipWaiting
  // bspw: wenn ein neuer SW den Scope mit skipWaiting übernommen hat
});
```

---


## Fetch API

Die [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) ist eine neue Alternative zum bekannten [XMLHttp​Request(XHR)](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), bietet jedoch einen mächtigeren und flexibleren Funktionsumfang. Fetch bietet ein allgemeines Interface mit `Request` und `Response` Objekten und kann von Service Workern, Cache API, etc angesprochen werden. Die Fetch API bietet eine `.fetch()` Methode mit der man auf einfachem Weg asynchrone Netzwerkanfragen senden kann.

> Leider ist der Internet Explorer wieder ein Spielverderber und kennt fetch nicht wirklich.  <br>
> [Github hat dafür einen guten Polyfill](https://github.com/github/fetch)

### .fetch()

Zu der API gibt es auch eine [`.fetch()`](https://developers.google.com/web/updates/2015/03/introduction-to-fetch) Methode, die ähnlich wie die `$.ajax()` in JQuery funktioniert. <br/>
`.fetch()` nimmt als Argument nur den Pfad zu einer Ressource. Es wird ein `Promise` zurückgegeben, das mit der `Response` zum request aufgelöst wird.

Unterschiede zu `$.ajax()`:
* Das "Promise" von `.fetch()` wird nicht abgewiesen, selbst bei HTTP 404/500.
  Stattdessen wird es normal aufgelöst ( `response.ok = false` ) und erst abgelehnt bei Netzwerkfehlern oder ähnlichem.
* Standardmäßig arbeitet `.fetch()` nicht mit Cookies. Deshalb müssen [Requests mit einer Angabe zu "credentials" gesendet](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Supplying_request_options) werden.

Optional kann die fetch-Methode noch ein `init` Objekt als Parameter annehmen.

Ein einfaches `.fetch()` Beispiel:
```js
const myImage = document.querySelector('img');

let myRequest = new Request('bockwurstwasser.jpg');

fetch(myRequest)
.then(function(response) {
  if (!response.ok) {
    throw new Error('HTTP error, status = ' + response.status);
  }
  return response.blob();
})
.then(function(response) {
  let objectURL = URL.createObjectURL(response);
  myImage.src = objectURL;
})
.catch(function(err) {
	// Error :(
});
```

Falls Cookies mitgegeben werden müssen, muss man die Angabe an das init-objekt weitergeben.

Beispiel:
```js
fetch('https://rawsta.de/data.json', {
  credentials: 'include'  // credentials werden mitgesendet (auch bei cross-origin!)
})
```

Weitere Parameter für credentials sind:
 * credentials: 'same-origin'  // credentials werden nur für den gleichen Origin genommen
 * credentials: 'omit' // credentials werden explizit weg gelassen

---


## Headers

Was die Flexibilität erhöht, ist die Möglichkeit die Header anzupassen.
Hier eine einfache Übersicht über die Verwendung:

```js
  // Eine neue Headers Instanz
  var headers = new Headers();

  // Weitere Header hinzufügen
  headers.append('Content-Type', 'text/plain');
  headers.append('X-My-Little-Header', 'Fabulous');

  // Check, get, and set header values
  headers.has('Content-Type'); // true
  headers.get('Content-Type'); // "text/plain"
  headers.set('Content-Type', 'application/json');

  // Header löschen
  headers.delete('X-My-Custom-Header');

  // Um die Header zu nutzen, muss eine neue Request Instanz erzeugt werden.
  var request = new Request('https://rawsta.de/api', {
    headers: new Headers({
		'Content-Type': 'text/plain'
	})
});
```

---


### Request

Ein Request Objekt stellt einen Teil des Fetchaufrufs dar. <br />
Durch das Request-Objekt kann man die Anfrage sehr gut anpassen. Hier eine kleine Liste verfügbaren Parameter:
* **method** - GET, POST, PUT, DELETE, HEAD
* **url** - URL of the request
* **headers** - associated Headers object
* **referrer** - referrer of the request
* **mode** - cors, no-cors, same-origin
* **credentials** - should cookies go with the request? omit, same-origin
* **redirect** - follow, error, manual
* **integrity** - subresource integrity value
* **cache** - cache mode (default, reload, no-cache)

Ein Beispiel für ein Request sieht folgend aus:
```js
  var request = new Request('https://rawsta.de/kontakte.json', {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    headers: new Headers({
      'Content-Type': 'text/plain'
    })
  });
  fetch(request).then(function() {
    /* response kommt hier */
});
```

Wie beim .fetch() ist nur der erste Paramter wichtig. Sobald das Request Objekt instanziert wurde, können die Properties nicht mehr angepasst werden. <br />
Das Request hat auch eine praktische `clone` Methode. Da ein Request ein Stream ist, muss er geklont werden um gleichzeitig bspw. gecacht zu werden.

Ein Request Objekt muss nicht unbedingt gesondert erzeugt werden. Für einfachere Einbindungen kann man die Parameter auch direkt übergeben:
```js
  fetch('https://rawsta.de/kontakte.json', {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    headers: new Headers({
      'Content-Type': 'text/plain'
    })
  }).then(function() {
    /* response */
});
```

---


### Response

Auf den `Request` folgt natürlich die `Response`. Wie beim `Request`, gibt es ein `Response` Objekt mit Möglichkeiten zur Anpassung.

Hier eine kleine Liste verfügbaren Parameter:
* `type` - _basic_, _cors_
* `url` - die URL
* `useFinalURL` - Boolean falls url bereits die finalURL ist - die URL
* `status` - HTTPstatus code _(bspw: 200, - die URL 404, 418, etc.)_
* `ok` - Boolean für erfolgreiche Response _(status 200-299)_
* `statusText` - status code _(bspw: OK)_
* `headers` - Headers verbunden mit der Response.

Eine eigene Response zu erstellen kann vorallem während der Entwicklung zum testen sehr praktisch sein.

Aufbau ist ähnlich wie beim Request:
```js
  var response = new Response('.....', {
    ok: false,
    status: 418,
    url: '/'
  });

  // The fetch's `then` gets a Response instance back
  fetch('https://rawsta.de/')
    .then(function(responseObj) {
      console.log('status: ', responseObj.status);
	});
```

Das Response Objekt verfügt über folgende Methoden:
* **clone()** - Klont die Response
* **error()** - gibt eine Response mit einem Netzwerkfehler zurück
* **redirect()** - Response mit anderer URL
* **arrayBuffer()** - Response als ArrayBuffer.
* **blob()** - Response als Blob.
* **formData()** - Response als FormData objekt.
* **json()** - Response als JSON objekt.
* **text()** - Response als USVString (text).

Sachen wie `response.json()` machen nichts anderes wie `JSON.parse(jsonString)`, sind aber praktischer für den Alltag.

---


## Cache API

Die [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) bietet einen einfachen Zugang zum `Cache Storage`.
Den Cache kann man sich wie ein Array von `Request` Objekten vorstellen, welche wie _keys_ für die `Response` funktionieren.

_Nicht zu verwechseln mit:_
 - [WebStorage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
 - [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
 - oder `AppCache`


### Caches

Um die eigentlichen Caches zu nutzen, reicht schon ein einfacher Aufruf mit einem Cachenamen:
```js
caches.open('test-cache').then(function(cache) {
  // Cache ist angelegt und verfügbar
});
```

Der `caches.open` aufruf gibt ein _Promise_ und das _Cache_ Objekt zurück.

Um den Cache zu befüllen gibt es 2 Methoden:
* `.addAll` fügt mehrere URLs als Array hinzu.
* `.add` fügt entweder eine einzelne URL oder ein eigenes _Request_ Objekt entgegen.

```js
caches.open('test-cache').then(function(cache) {
  cache.addAll(['/', '/images/logo.png'])
    .then(function() {
      // Cached!
    });
});
```

Zusätzlich zu `add` & `addAll` gibt es noch `put`. Jedoch mit dem Unterschied das man sowohl _Request_ als auch _Response_ angibt.
```js
fetch('/seite/1').then(function(response) {
  return caches.open('test-cache').then(function(cache) {
    return cache.put('/seite/1', response);
  });
});
```

Um wieder an die gecacheten Inhalte zu kommen, kann man die `keys` Methode des jeweiligen caches nutzen um das Array des _Request_ Objekts zu bekommen.
```js
caches.open('test-cache').then(function(cache) {
  cache.keys().then(function(cachedRequests) {
    console.log(cachedRequests); // [Request, Request]
  });
});
/*
Request {
  bodyUsed: false
  credentials: "omit"
  headers: Headers
  integrity: ""
  method: "GET"
  mode: "no-cors"
  redirect: "follow"
  referrer: ""
  url: "https://rawsta.de/images/logo.png"
}
*/
```

Um eine bestimmte _Response_ zu erhalten, kann man auch `cache.match` bzw. `cache.matchAll` benutzen:
```js
caches.open('test-cache').then(function(cache) {
  cache.match('/seite/1').then(function(matchedResponse) {
    console.log(matchedResponse);
  });
});
/*
Response {
  body: (...),
  bodyUsed: false,
  headers: Headers,
  ok: true,
  status: 200,
  statusText: "OK",
  type: "basic",
  url: "https://rawsta.de/seite/1"
}
*/
```

Wenn man eine bestimmte _Response_ nicht mehr braucht, lässt sie sich auch leicht wieder entfernen.
```js
caches.open('test-cache').then(function(cache) {
  cache.delete('/seite/1');
});
```

Um nachzuschauen welche caches bereits bestehen:
```js
caches.keys().then(function(cacheKeys) {
  console.log(cacheKeys); // bspw: "test-cache"
});
```
`window.caches.keys()` gibt ein _Promise_ zurück.


Um einen ganzen cache zu löschen:
```js
caches.delete('test-cache').then(function() {
  console.log('Cache erfolgreich gelöscht!');
});
```


Da es keine _garbage-collection_ oder ähnliches gibt, muss man selbst wieder aufräumen.<br />
Wenn man eine neue Version eines _ServiceWorkers_ oder _Caches_ anlegt, sollte man dabei auch die alten wieder löschen.
```js
// Name des neuen Caches
const CACHE_NAME = 'version-8';

// ...magic...

caches.keys().then(function(cacheNames) {
  return Promise.all(
    cacheNames.map(function(cacheName) {
      if(cacheName != CACHE_NAME) {
        return caches.delete(cacheName);
      }
    })
  );
});
```

-----

**Beispiel mit fetch, caches, etc:**

```js
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
```

---


## Push API

Mit der [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) ist es möglich Benachrichtigungen und Updates asynchron an den User zu schicken, selbst wenn die App nicht aktiv ist. Dafür muss ein User jedoch explizit dem zustimmen.

---

## IndexedDB API

Die [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) eignet sich für größere Mengen an strukturierten Daten_(inkl. Dateien/BLOBs)_.<br />
Da der Umgang mit der IndexedDB etwas kompliziert werden kann, wird allgemein die Nutzung eine einfacheren API empfohlen.

Gute Optionen sind [localForage](https://localforage.github.io/localForage/), [Dexie.js](https://dexie.org/)


---


## Warum Workbox?

Grundsätzlich kann man auch einen Service Worker komplett selbst schreiben und alle Routen,etc. selbst erstellen. Abgesehen vom Umfang ist auch die Fehleranfälligkeit höher, da es gerade bei umfangreicheren Seiten kompliziert werden kann. Service Worker, CacheAPI, usw. werden als sogenannte "lower-level" Bausteine bezeichnet, wofür es "higher-level" Tools wie Workbox _(ehemals sw-tools)_ gibt, um die Verwendung zu vereinfachen.

Ein Beispiel **ohne Workbox**:
```js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.put('my-awesome-cache').then(cache => {
      return catch.match(event.request).then(cacheResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          catch.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return cacheResponse || fetchPromise;
      });
    });
  );
});
```

Das gleiche Beispiel **mit Workbox**:
```js
workbox.strategies.staleWhileRevalidate({
  cacheName: 'my-awesome-cache',
  cacheExpiration: {
    maxAgeInSeconds: 60 * 30 //the cache will be expired in 30m
  }
});
```

Zusätzlich kümmert sich Workbox um eine Versionierung der Dateien(Hashes), zeitliche Begrenzungen des Caches und erleichtert Aktualisierungen. Das Cachen von GoogleAnalytics und Fonts ist natürlich ebenso einfach.

**Kleiner Nachteil**
:- Um den vollen Umfang (injectManifest,etc) nutzen zu können ist NPM nötig. Für den allgemeinen Betrieb ist es nicht notwendig.

**skipWaiting() & clientsClaim()**
Für diese beiden Funktionen gibt es auch Workbox pendants:
> workbox.core.skipWaiting();
> workbox.core.clientsClaim();

**-> [Allgemeines zu Workbox](https://developers.google.com/web/tools/workbox/)**

## Precaching

Precaching ist allgemein eher für statische Elemente wie HTML/Bilder/etc. geeignet. Diese Elemente werden bei der Installation direkt gecachet und dann bevorzugt aus dem Cache geladen. Für Aktualisierungen, fügt Workbox automatisch eigene Hashes hinzu.

Es sollten nur allgemeine Assets die für das initiale Laden relevant sind, zum precaching hinzugefügt werden. Precaching wird auch _install time caching_ bezeichnet.

> Es wird empfohlen die Precache Dateien mit [Workbox's Build Tools zu generieren](https://developers.google.com/web/tools/workbox/guides/precache-files/#generating_a_precache_manifest)
>Niemals die Revisions Infos/Hashes von Hand in das Manifest einfügen, precached URLs werden nur aktualisiert wenn die Hashes passen.

Damit das Precache Manifest (Teil des [WebManifest](/manifest-zur-pwa/)) korrekt eingebunden werden kann, ist es nötig, einen Einstiegspunkt in den Service Worker anzugeben. Das wird in der Regel durch die zeile **workbox.precaching.precacheAndRoute([]);** erledigt.

Workbox erweitert das Array dann mit den precache Daten.

**Beispiel:**
```js
 workbox.precaching.precacheAndRoute([
  {
    "url": "index.html",
    "revision": "7ca37fd5b27f91cd07a2fc68f20787c3"
  },
  {
    "url": "favicon.ico",
    "revision": "1378625ad714e74eebcfa67bb2f61d81"
  },
  {
    "url": "images/hamburger.svg",
    "revision": "d2cb0dda3e8313b990e8dcf5e25d2d0f"
  },
  ...
 ])
```

Standardmäßig setzt **workbox-precaching** seine eigenen listener für **install** und **activate** Events ein. <br />
Unter Umständen kann das nicht gewünscht sein. Dafür kann der [PrecacheController direkt angesprochen werden](https://developers.google.com/web/tools/workbox/modules/workbox-precaching#advanced_usage).

Um veraltete Caches wieder aufzuräumen hat Workbox auch eine eigene Methode:
 workbox.precaching.cleanupOutdatedCaches();

> [Mehr zu Workbox Precaching](https://developers.google.com/web/tools/workbox/modules/workbox-precaching)



### Runtime caching

Als _"Runtime caching"_ bezeichnet man das schrittweise hinzufügen zum Cache eben während der Laufzeit. Das hilft zukünftige Anfragen leichter und schneller zu beantworten. Der HTTP Cache vom Browser ist ein Beispiel dafür. Damit das leichter erledigt werden kann, regelt workbox das sogenannte **[routing](https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.routing)**. Das Routing besteht aus einer "Matching"-funktion _(entscheidet was gecacht wird)_ und einer "Handling"-funktion _(entscheidet was damit gemacht wird)_.

Das Routing wird in der **sw.js** angelegt und verwaltet.

```js
workbox.routing.registerRoute(
    /(.*)images(.*)\.(?:jpg|jpeg|png|gif)/,
    new workbox.strategies.CacheFirst({
        cacheName: 'bilder',
        plugins: [
           new workbox.expiration.Plugin({
              maxEntries: 50, //max anzahl an datein im cache
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Tage
           })
        ]
    })
 );
```

**Hinweise:**
> Reihenfolge ist wichtig! Routen werden der Reihe abgearbeitet und welche zuerst zutrifft, wird genommen.

> Bei Drittseiten aufrufen (Cross-Origin) muss die [RegEx vom anfang der URL](https://developers.google.com/web/tools/workbox/guides/route-requests#matching_a_route_with_a_regular_expression) zutreffen um die route auszulösen.

```js
new RegExp('^https://andere.domain.de/api/');
```


## Die verschiedenen Strategien

**`CacheFirst`**
Die `CacheFirst()` Strategie ist das Standardverhalten. Der Cache wird bevorzugt, bis es andere Anweisungen gibt. (Push, Force-Reload,etc) Der Cache wird solange genommen, bis die Anfrage scheitert. Erst dann wird das Netzwerk versucht.

**`NetworkFirst`**
Die `NetworkFirst()` Strategie ist das Gegenstück zur vorherigen. Es wird immer zu erst versucht eine aktuelle Version zu ziehen. Wenn die Anfrage scheitert oder zu lange braucht, wird der Cache genommen.

**`StaleWhileRevalidate`**
Die `StaleWhileRevalidate()` Strategie ist eine Mischung aus beidem. Es wird immer zuerst der Cache genommen. Jedoch wird gleichzeitig im Netz geschaut ob es eine Aktualisierung gibt. Falls es Änderungen gibt werden Cache und Ausgabe ebenfalls aktualisiert und beim nächsten Laden ausgeliefert.

**`NetworkOnly & CacheOnly`**
Die `NetworkOnly() / CacheOnly()` Strategien bestehen auf die Verwendung des Netzwerks/Caches.


### Workbox Plugins

Workbox hilft nicht nur beim Routing/Caching, sondern kann über Plugins auch erweitert werden.

**`workbox.broadcastUpdate.Plugin`**
Sobald ein Cache aktualisiert wurde, sende eine Benachrichtigung per Broadcast Channel oder via `postMessage()`.

**`workbox.backgroundSync.Plugin`**
Falls das Netzwerk nicht verfügbar ist, wird die Anfrage gespeichert und übertragen sobald das Netzwerk wieder verfügbar ist. _(bspw: kontaktformulare,etc)_

**`workbox.cacheableResponse.Plugin`**
Nur Cache Anfragen speichern, die bestimmte Kriterien erfüllen _(z.B.: stati: [0,200])_

**`workbox.expiration.Plugin`**
Die maximale Anzahl und Aufbewahrungsdauer festlegen.

**`workbox.rangeRequests.Plugin`**
Beantworte Anfragen die einen `Range:` header haben mit einer Response aus dem Cache.


[Weitere Informationen zu den Plugins](https://developers.google.com/web/tools/workbox/guides/using-plugins)

### Tipps und Tricks

Für die Entwicklung eignet sich momentan Chrome am besten.<br />
In den DevTools <kbd>F12</kbd> findet Ihr den Tab _"Application"_ wo Ihr schnell und einfach eine Übersicht über das Manifest, ServiceWorker, Caches, etc bekommen könnt.

_'Unter DevTools -> Application -> ServiceWorker solltet Ihr einen Haken bei "Update on reload" setzen._'
 * Zieht sich immer den aktuellen SW
 * Installiert immer die neue Version _( dadurch laufen jedesmal die `install`-events )_
 * Überspringt automatisch die Wartezeit ( `skipWaiting()` )
 * Steuert die aktuelle Seite erneut an

Dadurch erhält man immer die aktuellste Version _(im Optimalfall)_

Wenn der Service Worker richtig läuft, könnt Ihr den Haken wieder entfernen um mit dem vorhandenen SW arbeiten zu können.


#### Weiterführende Informationen zu Service Worker

 * [W3C Spezifikation](https://www.w3.org/TR/service-workers/)
 * [Service Worker Cookbook](https://serviceworke.rs/)
 * [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
 * [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
 * [Webseiten Analyse Tool (nicht nur PWA)](https://developers.google.com/web/tools/lighthouse/)
 * [Offline-Cookbook](https://jakearchibald.com/2014/offline-cookbook/)
