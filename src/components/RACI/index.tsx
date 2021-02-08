import { withDesign, addClasses, HOC } from '@bodiless/fclasses';
import { flow, identity } from 'lodash';
import { withEditorFullFeatured } from '../Editors';
import { asEditableLink } from '../Elements.token';
import {
  asBodilessTable,
  forCells,
  CleanTable,
} from '../Tables';
const asEditableTable = flow(
  asBodilessTable(),
  withDesign({
    Cell: withEditorFullFeatured('cell', ''),
  }),
);
const asDefaultTableStyle = flow(
  forCells(({ columnIndex, section }) => columnIndex % 2 === 1 && section === 'body')(addClasses('bg-gray-100')),
  withDesign({
    Cell: flow(addClasses('min-w-1 py-1 px-5')),
    THead: flow(addClasses('bg-gray-200')),
    Wrapper: addClasses('border border-gray-200'),
  }),
);
const firstColumnHalf = flow(
  forCells(({ columnIndex }) => columnIndex === 0)(addClasses('w-1/2 text-left')),
  withDesign({

  }),
);
const RACI1 = flow(
  asEditableTable,
  asDefaultTableStyle,
  firstColumnHalf,
  forCells(({ columnIndex }) => columnIndex !== 0)(addClasses('w-1/6 text-center')),
)(CleanTable);
const StandardTable = flow(
  asEditableTable,
  asDefaultTableStyle,
)(CleanTable);
export {
  RACI1,
  StandardTable,
};