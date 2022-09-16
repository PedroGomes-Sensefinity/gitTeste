import React from "react";
import ReactDOM from "react-dom";
import * as L from "leaflet";
import "leaflet-draw";
import "leaflet-extra-markers";
import * as turf from "@turf/turf";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import "leaflet/dist/leaflet.css";
import "./routeMap.css";

class RouteMap extends React.Component {
    map = null;
    drawnItems = null;

    constructor(props) {
        super(props);

        this.state = {
            sizeMeters: 15,
            route: props.route || {},
            prevRoute: props.route ? this.copyObject(props.route) : {},
            showGeofencing: props.showGeofencing || false,
            generatedGeofence: {},
            geofenceSizes: props.geofenceSizes ? this.copyObject(props.geofenceSizes) : [],
            prevGeofenceSizes: props.geofenceSizes ? this.copyObject(props.geofenceSizes) : [],
        };
    }

    componentDidMount() {
        this.initMap(this.state.route);
    }

    initMap(routeToDraw) {
        if (this.map) {
            this.map.off("click", this.onMapClick);
            this.map.remove();
            this.map = null;
        }

        var map = (this.map = L.map(ReactDOM.findDOMNode(this), {
            minZoom: 2,
            maxZoom: 20,
            layers: [
                L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution:
                        '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                }),
            ],
        }));

        var drawnItems = (this.drawnItems = new L.FeatureGroup());
        map.addLayer(drawnItems);
        var drawControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems,
                edit: false
            },
            draw: {
                polyline: true,
                marker: false,
                circlemarker: false,
                circle: false,
                polygon: false,
                square: false,
                rectangle: false,
            }
        });
        map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, this.onAddLayer);
        map.on(L.Draw.Event.EDITED, this.onEditLayer);
        map.on(L.Draw.Event.DELETED, this.onDeleteLayer);
        map.on("click", this.onMapClick);

        map.setView([38.7242, -9.1389], 13);

        if (typeof routeToDraw !== "undefined" && JSON.stringify(routeToDraw) !== '{}') {
            this.drawRoute(routeToDraw);
            this.setMapView();
        } else {
            this.setMapView();
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(function (location) {
                    var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

                    if(latlng.toBounds(0).isValid()) {
                        map.setView(latlng);
                    }
                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        // Verify if shapes sent are different than initialized map
        if (!this.isEqualObject(prevProps, this.props)) {
            // update values
            this.setState({route: this.props.route});
            this.setState({prevRoute: this.props.route});
            this.setState({geofenceSizes: this.props.geofenceSizes});
            this.setState({prevGeofenceSizes: this.props.geofenceSizes});

            if (typeof this.props.route !== "undefined" && JSON.stringify(this.props.route) !== '{}') {
                this.removeAllLayers();
                this.drawRoute(this.props.route);
            }
        }
    }

    componentWillUnmount() {
        if (!this.map) return;
        this.map.off("click", this.onMapClick);
        this.map.remove();
        this.map = null;
    }

    generateGeofencing(lineCoordinates) {
        let sizes = this.props.geofenceSizes;
        // If array sizes empty, fill with default value
        if (Array.isArray(sizes) && sizes.length === 0) {
            sizes = Array(lineCoordinates.length).fill(this.state.sizeMeters);
        }

        let line = turf.lineString(lineCoordinates, {});
        let coordinatesLine1 = [];
        let coordinatesLine2 = [];

        // Calculate offset based on size number
        lineCoordinates.map((value, i) => {
            let distance = sizes[i];
            let offsetLine1 = turf.lineOffset(line, distance, {units: 'meters'});
            let offsetLine2 = turf.lineOffset(line, -distance, {units: 'meters'});
            coordinatesLine1.push(offsetLine1.geometry.coordinates[i]);
            coordinatesLine2.push(offsetLine2.geometry.coordinates[i]);
        });

        coordinatesLine2 = coordinatesLine2.reverse();

        let generatedGeofence = coordinatesLine1.concat([coordinatesLine2[0]]);
        generatedGeofence = generatedGeofence.concat(coordinatesLine2);
        generatedGeofence = generatedGeofence.concat([coordinatesLine1[0]]);

        let conf = {
            style: {
                fillColor: "#FF0000FF",
                color: "#FF0000FF",
            }
        };

        let geojsonGeneratedGeofence = turf.polygon([generatedGeofence]);
        let leafletGeojson = L.geoJson(geojsonGeneratedGeofence, conf);
        let geofenceSizes = [];

        lineCoordinates.map(() => {
            geofenceSizes.push(this.state.sizeMeters);
        });

        this.setState({geofenceSizes: geofenceSizes})
        this.setState({generatedGeofence: geojsonGeneratedGeofence});
        this.drawnItems.addLayer(leafletGeojson);
    }

    generateMarkers(coordinates) {
        if (Array.isArray(coordinates)) {
            coordinates.map((c, i) => {
                var numberMarker = L.ExtraMarkers.icon({
                    icon: 'fa-number',
                    markerColorsubl: '#6b1d5c',
                    number: i+1,
                    svg: true,
                });
                this.drawnItems.addLayer(L.marker([c[1], c[0]], {icon: numberMarker}));
            });
        }
    }

    onMapClick = () => {};

    onAddLayer = (e) => {
        var layer = e.layer;
        this.drawRoute(layer.toGeoJSON());
    };

    onEditLayer = (e) => {};

    onDeleteLayer = (e) => {
        this.removeAllLayers();
    };

    removeAllLayers = () => {
        this.drawnItems.clearLayers();
        this.setState({generatedGeofence: {}});
        this.setState({geofenceSizes: []});
        this.updateRoute({});
    }

    drawRoute = (route) => {
        let drawnItems = this.drawnItems;
        var geojsonLayer = L.geoJson(route, {});
        geojsonLayer.eachLayer(function (l) {
            drawnItems.addLayer(l);
        });

        let coordinates = route.geometry.coordinates;
        // Show markers according route
        this.generateMarkers(coordinates);

        if (this.state.showGeofencing) {
            this.generateGeofencing(coordinates);
        }

        this.setMapView();
        this.updateRoute(route);
    }

    /**
     * When there is no route drawn yet, props.geofenceSizes coming from the parent component is empty so we use state.geofenceSizes. 
     * Otherwise, geofenceSizes is loaded from the database and passed down to routeMap in props.geofenceSizes. In these cases we use the props.
     */
    updateRoute = (route) => {
        var geofenceSizesToSend = this.props.geofenceSizes; // 

        if (this.props.geofenceSizes.length===0) {
            geofenceSizesToSend = this.state.geofenceSizes;
        }
        this.props.onChangeRoute({
            route: route,
            geofence: this.state.generatedGeofence,
            geofenceSizes: geofenceSizesToSend
        });
    };

    /**
     * Setting zoom of route (line string)
     */
    setMapView = () => {
        let bounds = this.drawnItems.getBounds();

        if (bounds.isValid()) {
            this.map.fitBounds(this.drawnItems.getBounds());
        }
    }

    copyObject = (obj) => {
        return JSON.parse(JSON.stringify(obj));
    };

    isEqualObject = (obj1, obj2) => {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };

    render() {
        return <div className="map" />;
    }
}

export default RouteMap;
