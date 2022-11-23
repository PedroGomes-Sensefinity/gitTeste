import React from "react";
import ReactDOM from "react-dom";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import markerIcon from 'leaflet/dist/images/marker-icon-2x.png';

class MapGeoPoint extends React.Component {
    map = null;
    drawnItems = null;

    constructor(props) {
        super(props);

        this.state = {
            position: props.position || {},
            prevPosition: props.position ? this.copyObject(props.position) : {},
        };
    }

    componentDidMount() {
        this.initMap(this.state.position);
    }

    initMap(position) {
        if (this.map) {
            this.map.off("click", this.onMapClick);
            this.map.remove();
            this.map = null;
        }

        var map = (this.map = L.map(ReactDOM.findDOMNode(this)))
            .setView([38.7242, -9.1389], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        if (typeof position !== "undefined" && JSON.stringify(position) !== '{}') {
            this.drawPosition(position);
        } else {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(function (location) {
                    var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

                    if(latlng.toBounds(0).isValid()) {
                        map.setView(latlng);
                    }
                });
                L.geoJSON({"type":"Feature","properties":{"name":"Name","radius":null},"geometry":{"type":"Polygon","coordinates":[[[-9.17911,38.698288],[-9.176877,38.702508],[-9.168033,38.706526],[-9.155926,38.708268],[-9.141929,38.706794],[-9.144419,38.700565],[-9.157557,38.697082],[-9.173958,38.695541],[-9.17911,38.698288]]]},"radius":null}).addTo(map);
            }
        }
    }

    componentDidUpdate() {
        // Verify if shapes sent are diferent than initialized map
        if (
            !this.isEqualObject(this.state.position, this.props.position)
            && typeof this.props.position !== "undefined"
            && JSON.stringify(this.props.position) !== '{}'
        ) {
            // update shapes
            this.setState({position: this.props.position});
            this.setState({prevPosition: this.props.position});
            this.drawPosition(this.props.position);
        }
    }

    componentWillUnmount() {
        if (!this.map) return;
        this.map.off("click", this.onMapClick);
        this.map.remove();
        this.map = null;
    }

    drawPosition(coord) {
        if (typeof coord === 'object' && 'lat' in coord && 'lon' in coord) {
            let DefaultIcon = L.icon({
                iconUrl: markerIcon,
                iconSize: [28, 46],
                iconAnchor: [17, 46]
            });

            L.marker([coord.lat, coord.lon], {icon: DefaultIcon})
                .addTo(this.map)
                .bindPopup(`${coord.lat},${coord.lon}`);

            let latlng = new L.LatLng(coord.lat, coord.lon);
            this.map.setView(latlng);
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

export default MapGeoPoint;