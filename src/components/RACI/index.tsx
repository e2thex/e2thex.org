import { withDesign, addClasses } from '@bodiless/fclasses';
import { flow } from 'lodash';
import { withEditorFullFeatured } from '../Editors';
import { asEditableLink } from '../Elements.token';
import {
  withCols,
  withNodeKeysTables,
  withHeadRows,
  withXRows,
  forCells,
  CleanTable,
} from '../Tables';

const RACI1 = flow(
  withCols('task', 'developer', 'po', 'sm'),
  withXRows(10),
  withHeadRows('0'),
  withNodeKeysTables,
  withDesign({
    // Cell: flow(addClasses('min-w-1 py-1 px-5'), withEditorFullFeatured('cell', '')),
    Cell: flow(addClasses('min-w-1 py-1 px-5'), withEditorFullFeatured('cell', '')),
    THead: flow(addClasses('bg-gray-200')),
    Wrapper: addClasses('border border-gray-200'),
    
  }),
  // forCells(({ columnIndex, section }) => columnIndex % 2 === 1 && section === 'body')(addClasses('bg-gray-100')),
  // forCells(({ column }) => column === 'task')(addClasses('w-1/2 text-left')),
  // forCells(({ column }) => column !== 'task')(addClasses('w-1/6')),
)(CleanTable);
export {
  RACI1,
};