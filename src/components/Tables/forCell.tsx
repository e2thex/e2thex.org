import { HOC, withDesign } from '@bodiless/fclasses';
import React, { ComponentType } from 'react';
import {
  CellProps, Section, TableBaseProps,
} from './types';
import TableManagerContext from './TableManagerContext';

type IfCellIsProps = CellProps & {
  data: TableBaseProps,
};
type IfCellIs = (props:IfCellIsProps) => boolean;
type CellTransFormProps = {
  passed: CellProps,
  hoc: HOC,
  Component: ComponentType<CellProps>,
  func:IfCellIs,
};
class CellTransform extends React.Component<CellTransFormProps> {
  static contextType = TableManagerContext;

  fixedProps: CellProps;

  Component: ComponentType<CellProps>;

  constructor(props:CellTransFormProps) {
    super(props);
    const { hoc, func, Component, passed, ...rest } = props;
    const data = this.context;
    this.fixedProps = { ...passed, ...rest };
    this.Component = func({ ...passed, data }) ? hoc(Component) : Component;
  }

  render() {
    const Component = this.Component as ComponentType<CellProps>;
    return <Component {...this.fixedProps} />;
  }
}
const ifCellIs = (func:IfCellIs) => (hoc:HOC) => (
  (Component:ComponentType<CellProps>) => (props:CellProps) => (
    <CellTransform
      hoc={hoc}
      func={func}
      passed={props}
      Component={Component}
    />
  ));
const forCells = (func:IfCellIs) => (hoc:HOC) => withDesign({
  Cell: ifCellIs(func)(hoc),
});
const forCell = (sectionIn:Section) => (rowIndexIn:number) => (columnIndexIn:number) => (
  forCells(({ section, rowIndex, columnIndex }) => (
    section === sectionIn
    && rowIndex === rowIndexIn
    && columnIndex === columnIndexIn
  ))
);
export default forCells;
export {
  ifCellIs,
  forCell,
};
