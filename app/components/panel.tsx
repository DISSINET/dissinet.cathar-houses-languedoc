import * as React from "react";
import { propTypes } from "mobx-react";
import Hero from "./hero";

type Props = {};

export default class PanelComponent extends React.Component<Props> {
  props;

  constructor(props) {
    super(props);
  }

  toggleCheckbox(groupId, optionId) {
    this.props.activateFilter(groupId, optionId);
  }

  handleOpenWelcome(e) {
    this.props.openWelcome();
  }

  renderCheckbox(data: { key; value; type; label; checked; event; style? }) {
    return (
      <li key={data.key} className="md:items-center ">
        <label className="block text-gray-500 font-bold">
          <span>
            {data.checked ? (
              <i
                id={data.key}
                onClick={data.event.bind(this)}
                className="icon icon-check mr-2 mt-2 text-muni"
              />
            ) : (
              <i
                id={data.key}
                onClick={data.event.bind(this)}
                className={
                  "icon mr-2 mt-2 text-black " +
                  (data.type === "checkbox" ? "icon-square" : "icon-circle")
                }
              />
            )}
          </span>
          <span
            id={data.key}
            onClick={data.event.bind(this)}
            className="text-sm align-text-top tb-2 font-normal"
          >
            {data.label}
          </span>
        </label>
      </li>
    );
  }

  render() {
    console.log(this.props.filters);
    return (
      <div className="panel" data-testid="panel-wrapper">
        <Hero />
        <br />
        <div className="panel-content px-4">
          {this.props.filters.map(filterGroup => {
            return (
              <div className="filter-group" key={filterGroup.id}>
                <b>{filterGroup.label}</b>
                <ul>
                  {" "}
                  {filterGroup.options.map(option => {
                    return this.renderCheckbox({
                      key: option.id,
                      value: option.id,
                      label: option.label,
                      type: filterGroup.type,
                      checked: option.active,
                      event: this.toggleCheckbox.bind(
                        this,
                        filterGroup.id,
                        option.id
                      )
                    });
                  })}
                </ul>
              </div>
            );
          })}
          <br />

          <div className="legend">
            <b>Legend</b>
            <div key="active-legend-line">
              <i
                id="legend-map-point-checked"
                className="fa-map-marker icon mr-2 mt-2 text-black fa fa-map-marker active"
              />
              <span className="text-sm align-text-top tb-2 font-normal">
                active records
              </span>
            </div>
            <div key="inactive-legend-line">
              <i
                id="legend-map-point-checked"
                className="fa-map-marker icon mr-2 mt-2 text-black fa fa-map-marker inactive"
              />
              <span className="text-sm align-text-top tb-2 font-normal">
                inactive records
              </span>
            </div>
          </div>
          <br />

          <div className="align-middle buttons ">
            <button
              className="text-base primary"
              onClick={this.handleOpenWelcome.bind(this)}
            >
              <i className="mr-2 icon icon-info" />
              info
            </button>
            <a
              href="https://docs.google.com/spreadsheets/d/1yYLd2ARWbyPxH9m3ZD7mYnVJS0UArv_pTav5nP1T2NE/edit#gid=0"
              target="_blank"
            >
              <button className="text-base primary">
                <i className="mr-2 icon icon-database" />
                dataset
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
