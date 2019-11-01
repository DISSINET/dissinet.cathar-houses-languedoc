import React from "react";
import L from "leaflet";
import { divIcon } from "leaflet";

import {
  Map,
  Marker,
  TileLayer,
  Pane,
  Tooltip,
  LayerGroup,
  LayersControl,
  ScaleControl
} from "react-leaflet";

type Props = {
  center: Array<Number>;
  zoom: Number;
  handleMapMoved: Function;
};

const radius = 25;
const m = 1.5;
const svgSizeX = 50;
const svgSizeY = 70;

export default class MapComponent extends React.Component<Props> {
  mapRef;
  mapEl;
  props;
  clusters;

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.mapEl = false;
  }

  componentDidMount() {
    if (this.mapRef && this.mapRef.current) {
      this.mapEl = this.mapRef.current.leafletElement;
      setTimeout(() => {
        this.mapEl.invalidateSize();
      }, 0);
    }
  }

  componentDidUpdate() {
    this.mapEl.invalidateSize();
  }

  points() {
    return this.props.active.map((feature, ri) => {
      return L.marker(feature.geometry.coordinates, {
        fillOpacity: 1,
        weight: 0,
        radius: 10,
        data: feature.properties
      }).bindPopup(
        "<div>[<i>" +
          feature.properties.id +
          "</i>] <strong>" +
          feature.properties.name +
          "</strong> " +
          feature.properties.yearsall +
          "</div>"
      );
    });
  }

  /*
        icon:  
        L.divIcon({
         html: <i>,
         className: "marker-icon " + (single ? "marker-single" : "marker-cluster"),
         iconSize: L.point(radius * 2, radius * 2)
  */

  handleMapMove(e) {
    if (this.mapEl) {
      this.props.handleMapMoved(e.center, e.zoom, this.mapEl.getBounds());
    }
  }

  icon(classes, style, size, anchor = false) {
    return divIcon({
      html:
        '<span style="' +
        style +
        '; vertical-align: bottom"' +
        ' class="icon"><i style="font-size:' +
        size[0] +
        'px" class="' +
        classes +
        '"></i></span>',
      className: "map-sort-icon",
      iconAnchor: anchor ? anchor : [size[0] / 2, size[1]],
      iconSize: size
    });
  }

  tooltip(record) {
    return (
      <div key={record.id}>
        [{record.id}] <b className="name">{record.placename}</b>
        <br />
        <i className="icon icon-clock"></i>{" "}
        {record.years.join(", ") || "no data"}
        <br />
        {record.sources.map(source => {
          return (
            <div key={source}>
              <i className="icon icon-scroll"></i> {source}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const iconSize = [25, 25];
    return (
      <div key="map" className="map" data-testid="map-wrapper">
        <Map
          center={this.props.center}
          zoom={this.props.zoom}
          maxZoom={16}
          minZoom={9}
          maxBounds={[[40, -2], [48, 6]]}
          ref={this.mapRef}
          onViewportChanged={this.handleMapMove.bind(this)}
        >
          <Pane style={{ zIndex: 300 }} key="active" name="active">
            {this.props.active.map((record, ri) => {
              return (
                <Marker
                  key={ri}
                  position={record.geo.geometry.coordinates}
                  icon={this.icon("fa fa-map-marker active", "", iconSize)}
                >
                  <Tooltip direction="right">
                    <div className="tooltip-content active">
                      {this.tooltip(record)}
                    </div>
                  </Tooltip>
                </Marker>
              );
            })}
          </Pane>
          <Pane style={{ zIndex: 250 }} key="inactive" name="inactive">
            {this.props.inactive.map((record, ri) => {
              return (
                <Marker
                  key={ri}
                  position={record.geo.geometry.coordinates}
                  icon={this.icon("fa fa-map-marker inactive", "", iconSize)}
                >
                  <Tooltip direction="right">
                    <div className="tooltip-content inactive">
                      {this.tooltip(record)}
                    </div>
                  </Tooltip>
                </Marker>
              );
            })}
          </Pane>

          <ScaleControl />
          <LayersControl>
            <LayersControl.BaseLayer name="awmc" checked={true}>
              <TileLayer
                key="awmc"
                maxNativeZoom={15}
                attribution="<a href='http://awmc.unc.edu/wordpress/'>Ancient World Mapping Center</a>"
                url="http://a.tiles.mapbox.com/v3/isawnyu.map-knmctlkh/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="cassini">
              <TileLayer
                key="cassini"
                maxNativeZoom={15}
                attribution="<a href='chartae-antiquae.cz'>chartae-antiquae.cz</a>"
                url="http://www.chartae-antiquae.cz/TMS/Francie/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="osm">
              <TileLayer
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.Overlay name="labels" checked={true}>
              <TileLayer
                key="stamen"
                attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}"
                subdomains="abcd"
                ext="png"
              />
            </LayersControl.Overlay>
          </LayersControl>
        </Map>
      </div>
    );
  }
}

/*
            (<LayerGroup className="osm">
              <TileLayer
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              />
            </LayerGroup>)
          */
