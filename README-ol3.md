# Extensions Géoportail pour OpenLayers 3

L'extension Géoportail pour OpenLayers 3 propose les fonctionnalités suivantes à utiliser en complément de la biblothèque [OpenLayers 3](http://openlayers.org/) :

* [affichage des couches WMTS Géoportail](#WMTS)

* [affichage des couches WMS Géoportail](#WMS)

* [affichage dynamique des attributions](#attributions)

* [widget de gestion d'empilement des couches](#layerswitcher)

* [barre de recherche utilisant le service de géocodage IGN](#geocode)

* [Obtention d'une adresse, d'un nom de lieu, ... au clic sur la carte](#reverse)

* [calculs d'itinéraires à partir du service de la plateforme Géoportail](#route)

* [calculs d'isochrones / isodistances à partir du service de la plateforme Géoportail](#isocurve)

* [altitude en un point de la carte à l'aide du service d'altimétrie de la plateforme Géoportail](#mp)

* [outils de dessin](#drawing)

## Mise en oeuvre

### Téléchargement

Vous pouvez récupérer l'extension Géoportail pour OpenLayers 3 ici [GpOpenLayers3.zip](#TODO). Elle contient l'arborescence suivante :

ol3/
    GpPluginOl3.js         (version minifiée du code javascript pour une utilisation en production)
    GpPluginOl3.css        (version minifiée des css pour une utilisation en production)
    GpPluginOl3-src.js     (version non minifiée du code javascript pour une utilisation en développement) 
    GpPluginOl3-src.css    (version non minifiée des css pour une utilisation en développement)
    img/
        (resources images utilisées par les fichiers CSS)


### Intégration dans une page web

Dézippez l'extension géoportail dans l'arborescence votre serveur web. Vous pouvez positionner à votre guise les fichiers css et javascript. Le répertoire img doit cependant être positionné au même niveau que le fichier css pour que les ressources images qui y sont référencées soient correctement chargées.

Intégrez l'extension géoportail pour ol3 dans votre page web classiquement à l'aide d'une balise **script** pour charger le fichier javascript et d'une balise **link** pour charger le fichier css en plus des balises correspondantes utilisées pour charger la bibliothèque OL3.

``` html
<!-- Library OpenLayers 3 -->
<link rel="stylesheet" href="chemin/vers/ol3/ol.css" />
<script src="chemin/vers/ol3/ol.js"></script>

<!-- Extension Géoportail pour OpenLayers 3 -->
<script src="chemin/vers/GpPluginOl3.js"></script>
<link rel="stylesheet" href="chemin/vers/GpOl3.css" />
```

<a id="config"/>

### Configuration de l'accès à la plateforme Géoportail

L'extension Géoportail pour OpenLayers 3 exploite les services web exposés par la plateforme Géoportail. Ceux-ci sont soumis à l'obtention d'une **clef d'accès** obtenue sur le site [professionnels.ign.fr](http://professionnels.ign.fr/api-web) ayant les droits sur les ressources que vous souhaitez exploiter.

Une fois la clef obtenue, vous pouvez paramétrer l'utilisation de l'extension avec cette clef de deux manières possibles :

1. Au chargement de l'extension en utilisant l'attribut "data-key" de la balise **script** de chargement de l'extension :

``` html
<script data-key="VOTRE-CLEF" src="chemin/vers/GpPluginOl3.js"></script>
```

Votre utilisation des fonctionnalités de l'extension Géoportail sera alors simplement conditionnée à la réception de l'événemment onload de la page web, comme sur l'exemple suivant :

``` html
<html>
    <head>
        <!-- Library OpenLayers 3 -->
        <link rel="stylesheet" href="ol.css" />
        <script src="ol.js"></script>
        <!-- Extension Géoportail pour OpenLayers 3 -->
        <link rel="stylesheet" href="GpPluginOl3.css" />
        <script src="GpPluginOl3.js" data-key="CLEAPI"></script>
    </head>
    <body>
        <script>
            window.onload = function () {
                // votre utilisation de l'extension Géoportail pour OpenLayers 3
            }
        </script>
    </body>
</html>
```

2. A la fin du chargement de la page en utilisant la fonction [Gp.Services.GetConfig()](https://github.com/IGNF/geoportal-access-lib#getConfig) et en conditionnant alors l'utilisation de l'extension à l'exécution de la fonction de rappel onSuccess passée en paramètres de Gp.Services.getConfig() comme sur l'exemple suivant :

``` html
<html>
    <head>
        <!-- Library OpenLayers 3 -->
        <link rel="stylesheet" href="ol.css" />
        <script src="ol.js"></script>
        <!-- Extension Géoportail pour OpenLayers 3 -->
        <link rel="stylesheet" href="GpPluginOl3.css" />
        <script src="GpPluginOl3.js"></script>
    </head>
    <body>
        <script>
            window.onload = function () {
                Gp.Services.getConfig({
                    apiKey: 'CLEAPI',
                    onSuccess: function (response) {
                        // votre utilisation de l'extension Géoportail pour OpenLayers 3
                    }
                });
            }
        </script>
    </body>
</html>
```

#### Optimisation du chargement : configuration locale

Partie à écrire...


## Compatibilités

### Version de OpenLayers 3 supportées

L'extension Géoportail pour OpenLayers 3 peut s'utiliser avec les **versions 3.x et supérieures** d'OpenLayers 3 (dernière version testée : 3.14).


### Navigateurs supportés


Navigateur | version
-----------|--------
Chrome     | Versions récentes (21+)
Firefox    | Versions récentes (28+)
IE         | IE10, IE11
Edge       | 12+
Safari     | Versions récentes (6.1+)


## Fonctionnalités

<a id="crs"/>

### Systèmes de coordonnées

OpenLayers 3 n'utilise par défaut que les systèmes de coordonnées mondiaux "standards" : EPSG:4326 (coordonnées géographiques) et EPSG:3857 (Projection Web Mercator utilisée par Google, Bings, OSM ... et le Géoprotail) comme expliqué [ici](http://openlayers.org/en/latest/apidoc/ol.proj.html).

La définition d'autres systèmes de coordonnées est cependant possible par l'adjonction de la bibliothèque [Proj4js](https://github.com/proj4js/proj4js) permettant de définir des systèmes de coordonnées et d'effectuer des transformations de coordonnées entre systèmes. Cette bibliothèque est directement compatible avec OpenLayers 3.

L'extension Géoportail pour OpenLayers 3 **intègre nativement cette bibliothèque**. Si vous l'utilisez vous pouvez donc directement définir les systèmes de coordonnées que vous souhaitez selon la syntaxe proj4 et utiliser les alias ainsi définis en paramètres des fonctions d'OpenLayers 3.

Exemple :

``` javascript
// Définition de la Projection UTM 20N 
proj4.defs("EPSG:4559",
    "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs") ;

// création d'une vue OL3 avec la projection définie
var view = new ol.View({
    center: [656481, 1796270],
    zoom: 12,
    projection: "EPSG:4559"
})
```

L'extension Géoportail pour OpenLayers 3 définit par défaut la projection légale Lambert 93 accessible sous l'alias "EPSG:2154".


NB : 

* Le site [spatialreference.org](http://spatialreference.org/) recense un grand nombre de registres de systèmes de coordonnées avec leurs définitions.

* Les définitions des systèmes de coordonnées du registre IGNF peuvent être trouvées [ici](https://github.com/OSGeo/proj.4/blob/master/nad/IGNF).


<a id="WMTS"/>

### Affichage des couche WMTS Géoportail

Le modèle de données OpenLayers 3 fait la distinction entre la notion de couche (ol.layer) et la notion de source de données (ol.source). Ainsi, une carte OpenLayers 3 est constituée d'un empilement de "ol.layer", avec des propriétés relatives à leurs visibilité sur la carte, dont le contenu est alimenté par des "ol.source", avec des propriétés relatives à la manière d'obtenir ces données.

L'extension Géoportail pour OpenLayers 3 propose deux manières d'accéder aux couches Géoportail selon ce modèle :

1. on souhaite une mise en oeuvre simple, où on saisit uniquement le nom de sa couche, et d'éventuels paramètres d'affichage (visibilité ou opacité). Définition d'un [layer WMTS Géoportail](#layerWMTS).

2. On souhaite pouvoir paramétrer plus finement l'affichage de sa couche dans la carte, ainsi que d'éventuels paramètres du service (format, style, ...). Définitions d'une [source WMTS Géoportail](#sourceWMTS).

<a id="layerWMTS"/>

#### Utilisation d'un layer WMTS Géoportail

L'affichage se fait par la création d'une nouvelle instance de la classe [ol.layer.GeoportalWMTS](https://depot.ign.fr/geoportail/extensions/ol3/develop/doc/ol.layer.GeoportalWMTS.html), de la manière suivante :

``` javascript
new ol.layer.GeoportalWMTS(options);
```

Cette fonction retourne un objet **ol.layer.GeoportalWMTS**, qui hérite de l'objet OpenLayers *ol.layer.Tile*, qui peut ainsi être interprété par la librairie OpenLayers pour l'ajout dans la carte.

##### Exemple d'utilisation

Affichage simple des ortho-images du Géoportail : création d'une *layer* Géoportail, et ajout à la *map* OpenLayers 3.

``` javascript
var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.GeoportalWMTS({
                layer: "ORTHOIMAGERY.ORTHOPHOTOS"
            })
        ],
        view: new ol.View({
            center: [288074.8449901076, 6247982.515792289],
            zoom: 12
        })
    });
```

**Exemple d'utilisation** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/j5rdjt2z/embedded/result,js,html,css/)

##### Affichage en Lambert 93 (EPSG:2154)

La plateforme Géoportail diffuse aussi des ressources WMTS en projection Lambert 93. Pour permettre de les afficher, l'extension Géoportail pour OpenLayers 3 pré-définit l'alias "EPSG:2154" correspondant à cette projection.

Il suffit alors de paramétrer la carte OpenLayers 3 avec cette projection et d'y rajouter la ressource WMTS de la même manière que précédemment.

``` javascript
var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.GeoportalWMTS({
            layer: "ORTHOIMAGERY.ORTHOPHOTOS.BDORTHO.L93"
        })
    ],
    view: new ol.View({
        center: [600000, 6750000],
        zoom: 12,
        projection : "EPSG:2154"
    })
});
```

**Exemple d'utilisation** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/bw0za4a8/embedded/result,js,html,css/)


NB : D'autres systèmes de coordonnées peuvent être définis et utilisés : [plus d'informations...](#crs)

<a id="layerWMTS"/>

#### Utilisation d'une source WMTS Géoportail


<a id="WMS"/>

### Affichage des couche WMS Géoportail

L'affichage des couches WMS Géoportail se fait à l'aide de la fonction [L.geoportalLayer.WMS()](http://depot.ign.fr/geoportail/extensions/ol3/develop/doc/module-Layers.html#~WMS), utilisée de la manière suivante :

``` javascript
L.geoportalLayer.WMS(options[,ol3Params]);
```

Cette fonction retourne un objet de type [L.TileLayer.WMS](http://ol3js.com/reference.html#tilelayer-wms).

### Exemple d'utilisation

#### Utilisation simple de la fonction

Affichage des orthos-images servies par le service WMS INSPIRE de la plateforme Géoportail sur une carte OpenLayers 3 en projection EPSG:4326.


``` javascript
// creation de la carte
var map = L.map("map",{
    crs : L.CRS.EPSG4326
}).setView([16.239, -61.545], 12);

// creation et ajout de la couche WMS à la carte
L.geoportalLayer.WMS({
    layer: "OI.OrthoimageCoverage"
}).addTo(map);
```

**Exemple d'utilisation** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/d9402Lba/embedded/result,js,html,css/)


<a id="layerswitcher"/>

### Widget de gestion d'empilement des couches

Ce widget permet à l'utilisateur de gérer l'empilement des couches composant la carte L.Map et, pour chacune d'elle, d'agir sur la visibilité, l'opacité et d'afficher des informations qui lui sont associées (titre, description, métadonnées, légende).

Son utilisation se fait par la création d'un nouveau contrôle à l'aide de la fonction [L.geoportalControl.LayerSwitcher()](http://depot.ign.fr/geoportail/extensions/ol3/develop/doc/module-Controls.html#~LayerSwitcher), que l'on peut ensuite ajouter à la carte comme [les autres contrôles OpenLayers 3](http://ol3js.com/reference.html#map-stuff-methods), par exemple de la manière suivante :

``` javascript
var layerSwitcher = L.geoportalControl.LayerSwitcher(opts);
map.addControl(layerSwitcher);
```

Le widget affiche l'ensemble des couches composant la carte L.Map.

Pour chaque couche de la carte L.Map, le widget affiche son titre et sa description (par défaut : l'identifiant OpenLayers 3 de la couche), et, si elles sont spécifiées, des informations plus détaillées : légendes, métadonnées, aperçu rapide.

La récupération de ces informations n'est pas la même selon la manière dont chaque couche a été ajoutée à la carte :

- Couches ajoutées via la [fonctionnalité d'affichage simple des couches WMS](#WMS) ou [WMTS du Géoportail](#WMTS) de l'extension pour OpenLayers 3 : ces informations sont disponibles car elles ont été chargées par lors de la [configuration de l'accès au Géoportail](#config), il n'y a donc rien à faire de particulier.

- Autres couches : afin d'afficher ces informations, il est nécessaire de les spécifier dans les options du widget.

#### Exemples d'utilisation

##### Utilisation simple

Ajout du widget de gestion de l'empilement des couches sans paramétrage particulier.

``` javascript
// Création de la carte
var map = L.Map('divmap', {center: [2.38, 45.23] , zoom: 13});

// création et ajout d'une cocuhe Géoportail
var lyr = L.geoportalLayer.WMTS({
    layer  : "ORTHOIMAGERY.ORTHOPHOTOS",
});
lyr.addTo(map); // ou map.addLayer(lyr);

// Création et ajout du LayerSwitcher
map.addControl(
    L.geoportalControl.LayerSwitcher()
);
```

##### Utilisation personnalisée

Paramétrage de l'affichage de la couche dans le LayerSwitcher.

``` javascript
// Création de la carte
var map = L.Map('divmap', {center: [2.38, 45.23] , zoom: 13});

// Création d'une couche quelconque
var lyr = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?') ;

// Création et ajout du LayerSwitcher à la carte
map.addControl(
    L.geoportalControl.LayerSwitcher({
        layers : [{
            layer : lyr,
            config : {
                title : "Couche externe",
                description : "Description de ma couche",
                quicklookUrl : "lien/Vers/UnApercuRapide.png",
                legends: [{url : "lien/Vers/UneLegende.png"}],
                metadata : [{url : "lien/Vers/Une/MetaDonnee.xml"}]
            }
        }],
        options : {
            collapsed : true
        }
    })
);
```

**Exemple d'utilisation** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/0t1nLra7/embedded/result,js,html,css/)

<a id="geocode"/>

### Barre de recherche

La barre de recherche permet de positionner la carte à partir de la saisie d'un localisant dont la position sera retournée par le service de géocodage de l'IGN.

La saisie de localisants peut s'accompagner d'un mode d'autocomplétion s'appuyant sur le service d'autocomplétion de la plateforme Géoportail.

Son utilisation se fait par la création d'un nouveau contrôle à l'aide de la fonction [L.geoportalControl.SearchEngine()](http://depot.ign.fr/geoportail/extensions/ol3/develop/doc/module-Controls.html#~SearchEngine), que l'on peut ensuite ajouter à la carte comme [les autres contrôles OpenLayers 3](http://ol3js.com/reference.html#map-stuff-methods), par exemple de la manière suivante :

``` javascript
var search = L.geoportalControl.SearchEngine(opts);
map.addControl(search);
```

#### Exemples d'utilisation

##### Utilisation simple

Ajout du moteur de recherhe sans paramétrage particulier.

``` javascript
// creation de la carte
map = L.map("map").setView([47, 2.424], 12);

// ajout d'une couche
var lyrMaps = L.geoportalLayer.WMTS({
    layer: "GEOGRAPHICALGRIDSYSTEMS.MAPS",
});
map.addLayer(lyrMaps) ;

// création et ajout du controle
var searchCtrl = L.geoportalControl.SearchEngine({
});
map.addControl(searchCtrl);
```

**Exemple d'utilisation** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/uLokwebc/embedded/result,js,html,css/)

<a id="route"/>

### Calculs d'itinéraires

Le widget de calcul d'itinéraires permet d'intéragir avec une carte OpenLayers 3 pour effectuer des calculs d'itinéraires utilisant le service dédié de la plateforme Géoportail.

Son utilisation se fait par la création d'un nouveau contrôle à l'aide de la fonction [L.geoportalControl.Route()](http://depot.ign.fr/geoportail/extensions/ol3/develop/doc/module-Controls.html#~Route), que l'on peut ensuite ajouter à la carte comme [les autres contrôles OpenLayers 3](http://ol3js.com/reference.html#map-stuff-methods), par exemple de la manière suivante :

``` javascript
var route = L.geoportalControl.Route(opts);
map.addControl(route);
```

#### Exemples d'utilisation

##### Utilisation simple

Ajout du widget sans paramétrage particulier.

``` javascript
// creation de la carte
map = L.map("map").setView([47, 2.424], 12);

// ajout d'une couche
var lyrMaps = L.geoportalLayer.WMTS({
    layer: "GEOGRAPHICALGRIDSYSTEMS.MAPS",
});
map.addLayer(lyrMaps) ;

// création et ajout du controle
var routeCtrl = L.geoportalControl.Route({
});
map.addControl(routeCtrl);
```

**Exemple d'utilisation** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/s30zo9eo/embedded/result,js,html,css/)

<a id="isocurve"/>

### Calculs d'isochrones / isodistances

Ce widget permet d'intéragir avec une carte OpenLayers 3 pour effectuer des calculs d'isochrones / isodistances utilisant le service dédié de la plateforme Géoportail.

Son utilisation se fait par la création d'un nouveau contrôle à l'aide de la fonction [L.geoportalControl.Isocurve()](http://depot.ign.fr/geoportail/extensions/ol3/develop/doc/module-Controls.html#~Isocurve), que l'on peut ensuite ajouter à la carte comme [les autres contrôles OpenLayers 3](http://ol3js.com/reference.html#map-stuff-methods), par exemple de la manière suivante :

``` javascript
var iso = L.geoportalControl.Isocurve(opts);
map.addControl(iso);
```

#### Exemples d'utilisation

##### Utilisation simple

Ajout du widget sans paramétrage particulier.

``` javascript
// creation de la carte
map = L.map("map").setView([47, 2.424], 12);

// ajout d'une couche
var lyrMaps = L.geoportalLayer.WMTS({
    layer: "GEOGRAPHICALGRIDSYSTEMS.MAPS",
});
map.addLayer(lyrMaps) ;

// création et ajout du controle
var isoCtrl = L.geoportalControl.Isocurve({
});
map.addControl(isoCtrl);
```

**Exemple d'utilisation** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/z85j92hv/embedded/result,js,html,css/)

<a id="mp"/>

### Altitude en un point de la carte

Ce widget permet d'afficher les coordonnées d'un point choisi par l'internaute sur une carte OpenLayers 3 dans un ou plusieurs systèmes de coordonnées. Ces coordonnées peuvent comprendre l'altitude obtenue à l'aide du service d'altimétrie de la plateforme Géoportail.

Son utilisation se fait par la création d'un nouveau contrôle à l'aide de la fonction [L.geoportalControl.MousePosition()](http://depot.ign.fr/geoportail/extensions/ol3/develop/doc/module-Controls.html#~MousePosition), que l'on peut ensuite ajouter à la carte comme [les autres contrôles OpenLayers 3](http://ol3js.com/reference.html#map-stuff-methods), par exemple de la manière suivante :

``` javascript
var mp = L.geoportalControl.MousePosition(opts);
map.addControl(mp);
```

#### Exemples d'utilisation

##### Utilisation simple

Ajout du widget sans paramétrage particulier.

``` javascript
// creation de la carte
map = L.map("map").setView([47, 2.424], 12);

// ajout d'une couche
var lyrMaps = L.geoportalLayer.WMTS({
    layer: "GEOGRAPHICALGRIDSYSTEMS.MAPS",
});
map.addLayer(lyrMaps) ;

// création et ajout du controle
var mpCtrl = L.geoportalControl.MousePosition({
});
map.addControl(mpCtrl);
```

**Exemple d'utilisation avec affichage unique de l'altitude** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/cenwojqe/embedded/result,js,html,css/)

**Exemple d'utilisation avec paramétrage des systèmes de coordonnées** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/oy601s3c/embedded/result,js,html,css/)
