import { keys, toJS, observable, action, computed } from "mobx";
import { inferredPredicate } from "@babel/types";

export default class AppStore {
  _center;
  _zoom;
  _extent;
  _filters;
  _welcome;
  data;
  _panel;

  defaultFilters = [
    {
      id: "period-mode",
      label: "Period - mode",
      type: "radio",
      options: [
        {
          id: "or",
          label: "OR",
          active: true
        },
        {
          id: "and",
          label: "AND",
          active: false
        }
      ]
    },
    {
      id: "period-time",
      label: "Periods",
      type: "checkbox",
      options: [
        {
          id: "until 1209",
          label: "until 1209",
          active: true
        },
        {
          id: "1210-1219",
          label: "1210-1219",
          active: true
        },
        {
          id: "1220-1229",
          label: "1220-1229",
          active: true
        },
        {
          id: "1230-1244",
          label: "1230-1244",
          active: true
        }
      ]
    }
  ];

  constructor(data) {
    this._center = observable.box([52, -1]);
    this._zoom = observable.box(7);
    this._extent = observable.box([]);
    this._welcome = observable.box(true);
    this._panel = observable.box(true);

    this._filters = observable.box(this.defaultFilters);
    this.data = data;
  }

  @computed
  get welcome() {
    return toJS(this._welcome);
  }

  @computed
  get panel() {
    return toJS(this._panel);
  }

  @computed
  get filters() {
    return toJS(this._filters);
  }

  @computed
  get center(): Array<Number> {
    return toJS(this._center);
  }

  @computed
  get zoom(): Number {
    return this._zoom.get();
  }

  @computed
  get extent(): Array<number> {
    return toJS(this._extent);
  }

  @computed
  get active(): Array<any> {
    const activeFilters = this.filters.filter(f => f.active);

    // TODO: implement filters
    return this.data.filter(feat => {
      return activeFilters.every(filter => filter.fn(feat));
    });
  }

  @action
  mapMoved(
    newCenter: Array<Number>,
    newZoom: Number,
    newExtent: Array<Number>
  ): void {
    this._center.set(newCenter);
    this._zoom.set(newZoom);
    this._extent.set(newExtent);
  }

  @action
  togglePanel() {
    this._panel.set(!this.panel);
  }
  @action
  openWelcome() {
    this._welcome.set(true);
  }

  @action
  closeWelcome() {
    this._welcome.set(false);
  }

  @action activateFilter(filterId) {
    const newFilters = toJS(this.filters);
    const filterToChange = newFilters.find(f => f.id === filterId);

    // TODO: implement filter logic

    console.log(newFilters);
    console.log(this);

    this._filters.set(newFilters);
  }
}
