import React from 'react';
import { TableFuncs } from './types';

const TableManagerContext = React.createContext({
  data: {
    columns: [] as string[],
    rows: [] as string[],
    headRows: [] as string[],
    footRows: [] as string[],
  },
  addColumn: () => undefined,
  deleteColumn: () => undefined,
  moveColumn: () => undefined,
  addRow: () => undefined,
  deleteRow: () => undefined,
  moveRow: () => undefined,
  addHeadRow: () => undefined,
  deleteHeadRow: () => undefined,
  moveHeadRow: () => undefined,
} as TableFuncs);
export default TableManagerContext;
