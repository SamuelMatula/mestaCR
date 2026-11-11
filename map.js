const mapStatus = document.querySelector("#map-status");
const cityList = document.querySelector("#cities");
const overviewButton = document.querySelector("#reset-view");

if (typeof L === "undefined") {
  mapStatus.textContent = "Knihovnu Leaflet se nepodařilo načíst. Zkontrolujte připojení a obnovte stránku.";
} else {
  const czechiaBounds = [[48.55, 12.05], [51.06, 18.87]];
  const map = L.map("map", { zoomSnap: 0.5 });

  function showOverview() {
    map.closePopup();
    map.fitBounds(czechiaBounds, { padding: [20, 20], animate: false });
  }

  showOverview();
  overviewButton.disabled = false;
  overviewButton.addEventListener("click", showOverview);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.control.scale({ imperial: false }).addTo(map);

  const cityIcon = L.divIcon({
    className: "city-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
    tooltipAnchor: [12, 0],
  });

  function textElement(tag, value, className) {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    return element;
  }

  function addCityDetails(feature, marker) {
    const { nazev, popsiek } = feature.properties;
    const popup = document.createElement("div");
    popup.className = "city-popup";
    popup.append(textElement("strong", nazev), textElement("p", popsiek));
    marker.bindPopup(popup);
    marker.bindTooltip(textElement("span", nazev), {
      permanent: true,
      direction: "right",
      className: "city-label",
    });

    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "city-button";
    button.append(
      textElement("span", nazev, "city-name"),
      textElement("span", popsiek, "city-description"),
    );

    button.addEventListener("click", () => {
      map.setView(marker.getLatLng(), Math.max(map.getZoom(), 11), { animate: false });
      marker.openPopup();
    });

    marker.on("popupopen", () => button.setAttribute("aria-current", "true"));
    marker.on("popupclose", () => button.removeAttribute("aria-current"));
    item.append(button);
    cityList.append(item);
  }

  async function loadCities() {
    const response = await fetch("./body.geojson");
    if (!response.ok) {
      throw new Error(`body.geojson: HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.type !== "FeatureCollection" || !Array.isArray(data.features)) {
      throw new Error("body.geojson musí obsahovat GeoJSON FeatureCollection.");
    }
    if (data.features.length === 0) {
      mapStatus.textContent = "V souboru body.geojson nejsou žádná města.";
      return;
    }

    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => L.marker(latlng, {
        icon: cityIcon,
        title: feature.properties.nazev,
      }),
      onEachFeature: addCityDetails,
    }).addTo(map);
    mapStatus.hidden = true;
  }

  loadCities().catch((error) => {
    cityList.replaceChildren();
    mapStatus.textContent = "Města se nepodařilo načíst. Ověřte soubor body.geojson a spusťte mapu přes místní webový server.";
    console.error(error);
  });
}
