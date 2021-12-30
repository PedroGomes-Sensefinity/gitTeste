import React from "react";
import ReactDOM from "react-dom";
import * as L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "./map.css";

class Map extends React.Component {
    map = null;
    drawnItems = null;

    constructor(props) {
        super(props);

        this.state = {
            shapes: props.shapes || [],
            prevShapes: props.shapes ? this.copyObject(props.shapes) : [],
        };
    }

    componentDidMount() {
        this.initMap(this.state.shapes);
    }

    initMap(shapesToDraw) {
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
        map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, this.onAddLayer);
        map.on(L.Draw.Event.EDITED, this.onEditLayer);
        map.on(L.Draw.Event.DELETED, this.onDeleteLayer);
        map.on("click", this.onMapClick);

        map.setView([38.7242, -9.1389], 13);

        if (shapesToDraw.length > 0) {
            this.drawLayers(shapesToDraw);
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

    componentDidUpdate() {
        // Verify if shapes sent are diferent than initialized map
        if (!this.isEqualObject(this.state.prevShapes, this.props.shapes)) {
            // update shapes
            this.setState({shapes: this.props.shapes});
            this.setState({prevShapes: this.props.shapes});

            this.removeAllLayers();
            this.drawLayers(this.props.shapes);
        }
    }

    componentWillUnmount() {
        if (!this.map) return;
        this.map.off("click", this.onMapClick);
        this.map.remove();
        this.map = null;
    }

    onMapClick = () => {};

    onAddLayer = (e) => {
        var layer = e.layer;
        var layerNum = this.drawnItems.getLayers().length + 1;
        var name = `Shape ${layerNum}`;

        layer.bindTooltip(name, { permanent: true, interactive: false });
        this.drawnItems.addLayer(layer);

        this.updateShapes();
    };

    onEditLayer = (e) => {
    };

    onDeleteLayer = (e) => {
        this.updateShapes();
    };

    removeAllLayers = () => {
        this.drawnItems.clearLayers();
    }

    drawLayers = (shapes) => {
        let drawnItems = this.drawnItems;

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
            geojsonLayer.eachLayer(function (l) {
                l.bindTooltip(s.name, { permanent: true, interactive: false });
                drawnItems.addLayer(l);
            });
        });
    }

    setMapView = () => {
        let bounds = this.drawnItems.getBounds();

        if (bounds.isValid()) {
            this.map.fitBounds(this.drawnItems.getBounds());
        }
    }

    updateShapes = () => {
        let shapes = [];

        this.drawnItems.eachLayer((layer) => {
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
                alert: "out",
            };

            shapes.push(newShape);
        });

        this.setState({ shapes: shapes });
        this.props.onChangeShape(shapes);
    };

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

export default Map;
