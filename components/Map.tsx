import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";

function concatGeoJSON(g1, g2) {
  console.log(g1, g2, "ee");
  return {
    type: "FeatureCollection",
    features: [...(g1.features || {}), ...(g2.features || {})],
  };
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-77.032, 38.913],
      },
      properties: {
        title: "Mapbox",
        description: "Washington, D.C.",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-122.414, 37.776],
      },
      properties: {
        title: "Mapbox",
        description: "San Francisco, California",
      },
    },
  ],
};

export const Map = ({ location, people }) => {
  const [route, setRoute] = useState<any>({});

  //submitform
  const submitForm = async (e) => {
    e.preventDefault();

    let to = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${e.target.to.value}&format=jsonv2`
    );

    const toCoords = [to.data[0].lat, to.data[0].lon];

    const ourRoute = await axios({
      url: "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      method: "POST",
      data: {
        coordinates: [
          [location.longitude, location.latitude],
          [toCoords[1], toCoords[0]],
        ],
      },
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept:
          "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        Authorization: process.env.NEXT_PUBLIC_ROUTE_API_KEY,
      },
    });

    // console.log("wee", concatGeoJSON(route, ourRoute.data));

    setRoute(ourRoute.data);
  };

  if (location.latitude && location.longitude) {
    const mapContainerRef = useRef(null);

    // initialize map when component mounts
    useEffect(() => {
      // console.log(location);

      console.log(people, "people");

      //   setRoute(people);
      //   setRoute(route.features ? concatGeoJSON(route, geojson) : geojson);

      console.log(route, "route");
      //   setRoute(route.features ? concatGeoJSON(route, geojson) : geojson);
      //   setRoute(geojson);

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        // See style options here: https://docs.mapbox.com/api/maps/#styles
        style: "mapbox://styles/mapbox/streets-v11",
        center: [location.longitude, location.latitude],
        zoom: 12.3,
        attributionControl: false,
      });

      map.on("load", () => {
        map.addSource("route", {
          type: "geojson",
          //   data: route,
          data: route,
        });
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#000",
            "line-width": 4,
          },
        });
      });

      //   map.addControl(
      //     new mapboxgl.GeolocateControl({
      //       positionOptions: {
      //         enableHighAccuracy: true,
      //       },
      //       // When active the map will receive updates to the device's location as it changes.
      //       trackUserLocation: true,
      //       // Draw an arrow next to the location dot to indicate which direction the device is heading.
      //       showUserHeading: true,
      //     })
      //   );

      for (const feature of route.features || []) {
        // create a HTML element for each feature
        const el = document.createElement("div");
        el.className = "w-5 h-5 bg-red-500 rounded-full";

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(feature.geometry.coordinates)
          .addTo(map);
      }

      //   if (this._map) {

      //   }

      //clean up on unmount
      return () => map.remove();
    }, [people, route]); // eslint-disable-line react-hooks/exhaustive-deps

    return location ? (
      <div>
        <form onSubmit={submitForm} className="flex space-x-2">
          <div className="flex flex-col">
            <label className="font-bold" htmlFor="to">
              To
            </label>
            <input
              name="to"
              className="rounded-lg px-4 py-2 border-2 border-black"
              placeholder="Ex: Los Angeles"
            />
          </div>
          <input type={"submit"} value="Submit" />
        </form>
        <div
          className="map-container w-[70vw] h-[70vh]"
          ref={mapContainerRef}
        />
      </div>
    ) : (
      <div className="w-[70vw] h-[70vh] animate-pulse rounded-lg bg-gray-100"></div>
    );
  } else {
    return <></>;
  }
};
