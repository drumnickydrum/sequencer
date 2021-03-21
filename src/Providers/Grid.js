import React, { useContext, useReducer, useRef } from 'react';

const INITIAL_CELL = {
  on: false,
  color: -1,
  velocity: 1,
  pitch: 24,
  length: 1,
  slice: 1,
};

const INIT_CELL = () => ({ ...INITIAL_CELL });

export const INIT_GRID = () => {
  let grid = [];
  for (let i = 0; i < 64; i++) {
    grid.push(INIT_CELL());
  }
  return grid;
};

const gridReducer = (state, { type, payload }) => {
  switch (type) {
    case 'editSound':
      return state;
    default:
      return state;
  }
};

export const CellsRef = React.createContext();
export const GridDispatch = React.createContext();
export const GridState = React.createContext();
export const GridProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gridReducer, INIT_GRID);
  const cellsRef = useRef({});
  return (
    <CellsRef.Provider value={cellsRef}>
      <GridDispatch.Provider value={dispatch}>
        <GridState.Provider value={state}>{children}</GridState.Provider>
      </GridDispatch.Provider>
    </CellsRef.Provider>
  );
};
