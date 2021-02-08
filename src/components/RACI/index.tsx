import { withDesign, addClasses } from '@bodiless/fclasses';
import { flow } from 'lodash';
import { withEditorFullFeatured } from '../Editors';
import { asEditableLink } from '../Elements.token';
import {
  asBodilessTable,
  forCells,
  CleanTable,
} from '../Tables';

const RACI1 = flow(
  asBodilessTable(undefined, {
    columns: ['task', 'developer', 'po', 'sm'],
    rows: (new Array(10)).fill('').map((t, i) => i.toString()),
    headRows: ['0'],
    footRows: [],
  }),
  withDesign({
    Cell: flow(addClasses('min-w-1 py-1 px-5'), withEditorFullFeatured('cell', '')),
    THead: flow(addClasses('bg-gray-200')),
    Wrapper: addClasses('border border-gray-200'),
  }),
  forCells(({ columnIndex, section }) => columnIndex % 2 === 1 && section === 'body')(addClasses('bg-gray-100')),
  forCells(({ columnIndex }) => columnIndex === 1)(addClasses('w-1/2 text-left')),
  forCells(({ column }) => column !== 'task')(addClasses('w-1/6')),
)(CleanTable);
export {
  RACI1,
};