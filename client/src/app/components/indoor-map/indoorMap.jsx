import React from "react";
import ReactDOM from "react-dom";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-imageoverlay-rotated";
import "./indoorMap.css";

class IndoorMap extends React.Component {
    map = null;

    componentDidMount() {
        const script = document.createElement("script");
        script.src = "https://leaflet.github.io/Leaflet.Icon.Glyph/Leaflet.Icon.Glyph.js";
        script.async = true;
        document.body.appendChild(script);

        this.initMap();
    }

    componentDidUpdate() {
        this.initMap();
    }

    componentWillUnmount() {
        if (!this.map) return;
        this.map.remove();
        this.map = null;
    }

    initMap() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }

        var map = (this.map = L.map(ReactDOM.findDOMNode(this)))
            .setView([38.7242, -9.1389], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>',
            maxZoom: 25
        }).addTo(map);

        if (typeof this.props.plant !== 'undefined' && this.validatePlantPositions()) {
            var topleft = L.latLng(this.props.plantPositions.topleft_lat, this.props.plantPositions.topleft_lon),
            topright = L.latLng(this.props.plantPositions.topright_lat, this.props.plantPositions.topright_lon),
            bottomleft = L.latLng(this.props.plantPositions.bottomleft_lat, this.props.plantPositions.bottomleft_lon);

            L.imageOverlay.rotated(this.props.plant, topleft, topright, bottomleft, {
                opacity: 1,
                interactive: false
            }).addTo(map);

            var plantPoints = [topleft, topright, bottomleft];
            var plantPointsBounds = new L.LatLngBounds(plantPoints);
            map.fitBounds(plantPointsBounds);
            map.setZoom(19);
        }

        if (typeof this.props.anchors !== 'undefined' && this.props.anchors.length > 0) {
            this.props.anchors.map(a => {
                L.marker([a.lat, a.lon], {icon: L.icon.glyph({ prefix: 'fa', glyph: 'broadcast-tower' }) })
                    .addTo(map);
            });
        }
    }

    validatePlantPositions = () => {
        return (
            ('topleft_lat' in this.props.plantPositions) &&
            ('topleft_lon' in this.props.plantPositions) &&
            ('topright_lat' in this.props.plantPositions) &&
            ('topright_lon' in this.props.plantPositions) &&
            ('bottomleft_lat' in this.props.plantPositions) &&
            ('bottomleft_lon' in this.props.plantPositions)
        );
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

export default IndoorMap;
