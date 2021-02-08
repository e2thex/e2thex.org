import React, { ComponentType } from 'react';
import CleanTable from './Table';
import asBodilessTable from './asBodilessTable';
import forCells, { forCell } from './forCell';
import { flow, identity } from 'lodash';
import { Section } from './types';
import { A } from '@bodiless/fclasses';

const withCols = <A extends Object> (...columns:string[]) => (
  (Component:ComponentType<A>) => (props:A) => (
    <Component columns={columns} {...props} />
  ));
const withRows = <A extends Object> (...rows:string[]) => (
  (Component:ComponentType<A>) => (props:A) => (
    <Component rows={rows} {...props} />
  ));
const withXRows = (x:number) => {
  const rows = (new Array(x)).fill('').map((t, i) => i.toString());
  return withRows(...rows);
}
const withHeadRows = <A extends Object> (...rows:string[]) => (
  (Component:ComponentType<A>) => (props:A) => (
    <Component headRows={rows} {...props} />
  ));
type TableContentRow = string[];
type TableContent = TableContentRow[];

const withInnerText = <A extends object>(text:string) => (
  (Component:ComponentType<A>) => (props:A) => (
    <Component {...props}>{text}</Component>
  )
);
type WithContentProps = {
  body: TableContent,
  head: TableContent,
};
const withContent = (props:WithContentProps) => {
  const { body, head } = props;
  const headHocs = head.map((row, rowIndex) => (
    row.map((cell, columnIndex) => (
      forCell(Section.head)(rowIndex)(columnIndex)(withInnerText(cell))
    ))
  ));
  const bodyHocs = body.map((row, rowIndex) => (
    row.map((cell, columnIndex) => (
      forCell(Section.body)(rowIndex)(columnIndex)(withInnerText(cell))
    ))
  ));
  console.log(body);
  const columns = head[0] || body[0] || [];
  const tableHocs = [
    withCols(...columns.map((t, i) => i.toString())),
    withRows(...body.map((t, i) => i.toString())),
    withHeadRows(...head.map((t, i) => i.toString())),
  ];
  return flow(...tableHocs, ...[...headHocs, ...bodyHocs].reduce((a, row) => [...a, ...row], []));
};

export {
  withCols,
  withXRows,
  withHeadRows,
  asBodilessTable,
  forCells,
  CleanTable,
  withContent,
};
