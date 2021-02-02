import { 
  addClasses,
  Caption as SCaption,
  designable,
  HOC,
  startWith,
  StylableProps,
  Table as STable,
  Tbody as STbody,
  Td as STd,
  Th as STh,
  Thead as SThead,
  Tr as STr,
  Tfoot as STfoot,
  withDesign
} from '@bodiless/fclasses';
import { flow } from 'lodash';
import React, { ComponentType, FunctionComponent, HTMLProps } from 'react';
import { asBold } from '../Elements.token';
import { DesignableComponentsProps}  from '@bodiless/fclasses';
import { withEditableFinalTrail } from '../Breadcrumbs/MenuBreadcrumbs.token';
import { withEditorFullFeatured } from '../Editors';
import { withNode, withNodeKey } from '@bodiless/core';

type BTable = {
  Table: ComponentType<StylableProps>,
  TBody: ComponentType<StylableProps>,
  THead: ComponentType<StylableProps>,
  TFoot: ComponentType<StylableProps>,
  TR: ComponentType<StylableProps>,
  TD: ComponentType<StylableProps>,
  TH: ComponentType<StylableProps>,
};
const bTablecomponents = {
  Table: STable,
  TBody: STbody,
  THead: SThead,
  TFoot: STfoot,
  Tr: STr,
  Td: STd,
  Th: STh,
};

const BTable = ({columns, headRows, rows, components, ...rest}) => {
  const {
    Table,
    TBody,
    THead: THeadx,
    TFoot,
    Th,
    Tr,
    Td,
  } = components;
  const THead = withNodeKey('thead')(withNode(THeadx));
  return (
    <Table {...rest}>
      <THead>
        {headRows.map((row) =>{
          const Row = withNodeKey(row)(withNode(Tr));
          return (
            <Row key={row}>
             {columns.map((col) => {
                const Cell = withNodeKey(col)(withNode(Th));
                return <Cell key={col} />
              })} 
            </Row>
          );
        })}
      </THead>
      <TBody>
        {rows.map((row) =>{
          const Row = withNodeKey(row)(withNode(Tr));
          return (
            <Row key={row}>
             {columns.map((col) => {
                const Cell = withNodeKey(col)(withNode(Td));
                return <Cell key={col} />
              })} 
            </Row>
          );
        })}
      </TBody>
    </Table>
  );
};
const CleanBTable = designable(bTablecomponents, 'Table')(BTable);

const withCols = <A extends Object> (...columns:string[]) => (Component:ComponentType<A>) => (props:A) => (
  <Component columns={columns} {...props} />
);
const withRows = <A extends Object> (...rows:string[]) => (Component:ComponentType<A>) => (props:A) => (
  <Component rows={rows} {...props} />
);
const withXRows = (x:number) => {
  const rows = (new Array(x)).fill('').map((t, i) => i.toString());
  return withRows(...rows);
}
const withHeadRows = <A extends Object> (...rows:string[]) => (Component:ComponentType<A>) => (props:A) => (
  <Component headRows={rows} {...props} />
);
const RACI1 = flow(
  withCols('task', 'developer', 'po', 'sm'),
  withXRows(12),
  withHeadRows('0'),
  withDesign({
    Td: flow(addClasses('min-w-1'), withEditorFullFeatured('cell', 'Cell')),
    Th: flow(addClasses('min-w-1'), withEditorFullFeatured('cell', 'Cell')),
  }),
)(CleanBTable);
/*
const RACI2 = flow(
  withRACIBodyRow('Row01')('Creating a plan for the Sprint, the Sprint Backlog;'),
  withRACIBodyRow('Row02')('Instilling quality by adhering to a Definition of Done;'),
  withRACIBodyRow('Row03')('Adapting their plan each day toward the Sprint Goal; and,'),
  withRACIBodyRow('Row04')('Holding each other accountable as professionals.'),
  withRACIBodyRow('Row05')('maximizing the value of the product resulting from the work of the Scrum Team'),
  withRACIBodyRow('Row06')('Developing and explicitly communicating the Product Goal;'),
  withRACIBodyRow('Row07')('Creating and clearly communicating Product Backlog items;'),
  withRACIBodyRow('Row08')('Ordering Product Backlog items; and,'),
  withRACIBodyRow('Row09')('Ensuring that the Product Backlog is transparent, visible and understood'),
  withRACIBodyRow('Row10')(' establishing Scrum as defined in the Scrum Guide'),
  withRACIBodyRow('Row11')('the Scrum Team’s effectiveness'),
)(CleanTable);
*/
// const HeadRow = flow(asBold, addClasses('border px-5 align-center'))(Th);
// const TD = flow(addClasses('border px-5 text-center'))(Td);
export {
  RACI1
};
