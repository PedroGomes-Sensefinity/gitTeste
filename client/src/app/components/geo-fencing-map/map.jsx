import * as L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef } from "react";
import utils from '../../utils/utils';
import "./map.css";
// using this guide https://cherniavskii.com/using-leaflet-in-react-apps-with-react-hooks/
function Map(props) {
    const map = useRef(null);
    const drawnItems = useRef(null);
    const shapes = props.shapes

    useEffect(() => {
        if (map.current === null) {
            map.current = L.map('map', {
                minZoom: 2,
                layers: [
                    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                    }),
                ],
            });

            map.current.on(L.Draw.Event.CREATED, onAddLayer);
            map.current.on(L.Draw.Event.DELETED, onDeleteLayer);
        }

        if (drawnItems.current === null) {
            drawnItems.current = new L.FeatureGroup();
            map.current.addLayer(drawnItems.current);

            var drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: drawnItems.current,
                    edit: false,
                },
                draw: {
                    polyline: false,
                    marker: false,
                    circlemarker: false,
                    circle: true,
                    polygon: {
                        allowIntersection: false,
                        showArea: true,
                    },
                }
            });
            map.current.addControl(drawControl);
        }

        if (shapes.length > 0) {
            removeAllLayers()
            drawLayers(shapes);
            setMapView();
        } else {
            map.current.setView([38.7242, -9.1389], 10);
            setMapView();
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(function (location) {
                    var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

                    if (latlng.toBounds(0).isValid()) {
                        map.current.setView(latlng);
                    }
                });
            }
        }

        return () => {
            if (!map.current) return;
            map.current.remove();
            map.current = null;
        }
    }, []);

    useEffect(() => {
        removeAllLayers()
        drawLayers();
        setMapView();
    }, [shapes]);

    const removeAllLayers = () => {
        if (drawnItems.current !== null)
            drawnItems.current.clearLayers()
    }

    const onAddLayer = (e) => {
        var layer = e.layer;
        var layerNum = drawnItems.current.getLayers().length + 1;
        var name = `Shape ${layerNum}`;

        layer.bindTooltip(name, { permanent: true, interactive: false });
        drawnItems.current.addLayer(layer);
        updateShapes();
    };

    const onDeleteLayer = (e) => {
        updateShapes();
    };

    const drawLayers = () => {
        shapes.forEach((s) => {
            let conf = {};
            // Circle shape
            if (s.geoJSON.properties.radius !== null) {
                conf = {
                    pointToLayer: (feature, latlng) => {
                        return new L.Circle(latlng, feature.properties.radius);
                    }
                };
            }
            var geojsonLayer = L.geoJson(s.geoJSON, conf);
            geojsonLayer.eachLayer((l) => {
                l.bindTooltip(s.name, { permanent: true, interactive: false });
                drawnItems.current.addLayer(l);
            });
        });
    };

    const setMapView = () => {
        if (shapes.length !== 0) {
            const { minLat, minLong, maxLat, maxLong } = shapes.map(s => utils.getMaxMinCoordinatesInterval(s.geoJSON.geometry.coordinates))
                .reduce((prev, curr) => {
                    return {
                        minLat: Math.min(prev.minLat, curr.minLat),
                        maxLat: Math.max(prev.maxLat, curr.maxLat),
                        minLong: Math.min(prev.minLong, curr.minLong),
                        maxLong: Math.max(prev.maxLong, curr.maxLong),
                    }
                });
            const x = minLong + (maxLong - minLong) / 2
            const y = minLat + (maxLat - minLat) / 2
            map.current = map.current.flyTo(L.latLng(x, y), map.current.getZoom())
        } else {
            let bounds = drawnItems.current.getBounds();

            if (bounds.isValid()) {
                map.current.fitBounds(drawnItems.current.getBounds());
            }
        }
    };


    const updateShapes = () => {
        let shapes = [];
        drawnItems.current.eachLayer((layer) => {
            let geojson = layer.toGeoJSON();
            let radius = "_mRadius" in layer ? layer._mRadius : null;

            geojson.properties = {
                name: 'Name',
                radius: radius
            };

            let newShape = {
                id: layer._leaflet_id,
                name: layer._tooltip._content,
                geoJSON: geojson,
                radius: radius,
            };

            shapes.push(newShape);
        });
        props.onChangeShape(shapes);
    };

    return <div className="map" id="map" />;
};

export default Map;
