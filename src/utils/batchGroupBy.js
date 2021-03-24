import { groupByActionTypes } from 'redux-undo';
import cuid from 'cuid';

export const batchGroupBy = {
  _group: null,
  start(group = cuid()) {
    this._group = group;
  },
  end() {
    this._group = null;
  },
  init(rawActions) {
    const defaultGroupBy = groupByActionTypes(rawActions);
    return (action) => this._group || defaultGroupBy(action);
  },
};
