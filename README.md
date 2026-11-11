# Města Česka

Interaktivní mapa v Leafletu zobrazuje Prahu a Olomouc. Kliknutím na bod otevřete popisek. Výběrem města v seznamu mapu přiblížíte. Tlačítko **Přehled Česka** vrátí výchozí pohled.

## Spuštění

1. Uložte všech pět souborů do jedné složky a otevřete ji v terminálu.
2. Spusťte místní server příkazem `python3 -m http.server 8000 --bind 127.0.0.1`.
3. Otevřete [http://127.0.0.1:8000/](http://127.0.0.1:8000/) v prohlížeči.

Pro načtení GeoJSONu otevřete stránku přes HTTP. Leaflet a mapové dlaždice se načítají z internetu.

## Soubory

| Soubor | Obsah |
| --- | --- |
| `index.html` | Struktura stránky a odkazy na Leaflet |
| `map.js` | Nastavení mapy, načtení bodů a obsluha výběru města |
| `styl.css` | Vzhled stránky a rozvržení pro mobilní zařízení |
| `body.geojson` | Body měst ve formátu GeoJSON |
| `README.md` | Návod ke spuštění a úpravě dat |

## Přidání města

V souboru `body.geojson` přidejte do pole `features` nový objekt `Feature` s geometrií `Point`. Do `coordinates` zadejte `[zeměpisná délka, zeměpisná šířka]` v desetinných stupních. Do `properties` přidejte jedinečné `id`, textový `nazev` a textový `popsiek`. Klíč `popsiek` je zapsaný podle zadání. Po uložení souboru obnovte stránku.

## Zdroje

- [Leaflet 1.9.4](https://leafletjs.com/examples-v1/quick-start/)
- [Mapový podklad OpenStreetMap](https://www.openstreetmap.org/copyright)
- [Souřadnice Prahy](https://wiki.openstreetmap.org/wiki/Praha) a [Olomouce](https://wiki.openstreetmap.org/wiki/Olomouc)
