import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { join } from "path";
import { createGeoJSONCircle } from "../util/geoJSONCircle";
import { toast } from "react-toastify";

function concatGeoJSON(g1, g2) {
  console.log(g1, g2, "ee");
  return {
    type: "FeatureCollection",
    features: [...(g1.features || {}), ...(g2.features || {})],
  };
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const Map = ({ location, people }) => {
  const [route, setRoute] = useState<any>(people);

  //submitform
  const submitForm = async (e) => {
    try {
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
          radiuses: [10000],
        },
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          Authorization: process.env.NEXT_PUBLIC_ROUTE_API_KEY,
        },
      });

      // console.log("wee", concatGeoJSON(route, ourRoute.data));

      setRoute(concatGeoJSON(people, ourRoute.data));
    } catch (err) {
      toast.error("Invalid location", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (location.latitude && location.longitude) {
    const mapContainerRef = useRef(null);

    // initialize map when component mounts
    useEffect(() => {
      // console.log(location);

      // console.log(people, "people");

      //   setRoute(route.features ? concatGeoJSON(route, people) : people);
      //   setRoute(route.features ? concatGeoJSON(route, geojson) : geojson);

      // console.log(route, "route");
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
        map.addSource("people", {
          type: "geojson",
          //   data: route,
          data: people,
        });
        map.addSource("route", {
          type: "geojson",
          //   data: route,
          data: route,
        });

        map.addSource(
          "polygon",
          createGeoJSONCircle([location.longitude, location.latitude], 9)
        );

        map.addLayer({
          id: "polygon",
          type: "fill",
          source: "polygon",
          layout: {},
          paint: {
            "fill-color": "blue",
            "fill-opacity": 0.2,
          },
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

        map.addLayer({
          id: "people",
          type: "circle",
          source: "people",
          paint: {
            "circle-color": "#4264fb",
            "circle-radius": 6,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
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

      //   eeeee
      //   for (const feature of people.features || []) {
      //     // create a HTML element for each feature
      //     // if (feature.geometry.type !== "Point") {
      //     //   continue;
      //     // }

      //     const el = document.createElement("div");
      //     el.className = "w-5 h-5 bg-red-500 rounded-full";
      //     //   el.style.backgroundImage(people.)

      //     // make a marker for each feature and add to the map
      //     new mapboxgl.Marker(el)
      //       .setLngLat(feature.geometry.coordinates)
      //       .addTo(map);
      //   }

      //   if (this._map) {

      //   }

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on("mouseenter", "people", (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = "pointer";

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
      });

      map.on("mouseleave", "people", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
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

      //clean up on unmount
      return () => map.remove();
    }, [people, route]); // eslint-disable-line react-hooks/exhaustive-deps

    return location ? (
      <div className="space-y-2 px-4 lg:px-0">
        <form onSubmit={submitForm} className="flex space-x-2">
          <div className="flex items-center space-x-3">
            <label className="font-bold" htmlFor="to">
              To
            </label>
            <input
              name="to"
              className="rounded-lg px-4 py-2 border-2 border-black"
              placeholder="Ex: Los Angeles"
            />
          </div>
          {/* <input type={"submit"} value="Submit" /> */}
        </form>
        <div
          className="map-container w-[92vw] md:w-[78vw] h-[65vh] md:h-[68vh]"
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
