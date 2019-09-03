import { keys, toJS, observable, action, computed } from "mobx";

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
      category: "revolts",
      id: "revolts-all",
      label: "no filter",
      fn: p => true,
      active: true
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

    if (filterToChange) {
      newFilters
        .filter(f => f.category === filterToChange.category)
        .forEach(f => (f.active = false));
      filterToChange.active = true;
    }
    console.log(newFilters);
    console.log(this);

    this._filters.set(newFilters);
  }
}
