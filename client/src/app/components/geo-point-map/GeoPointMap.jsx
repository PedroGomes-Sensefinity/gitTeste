import React from "react";
import ReactDOM from "react-dom";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import markerIcon from 'leaflet/dist/images/marker-icon-2x.png';
import { get } from "lodash";

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
        if(this.props.shapes != undefined){
            this.props.shapes.forEach(s =>{
                L.geoJSON(s.geoJSON,{style: { "color": "rgba(0, 0, 180, 0.06)", "fillOpacity": .35 }}).addTo(this.map);
            })
            
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