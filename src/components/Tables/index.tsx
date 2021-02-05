import { 
  addClasses,
  Caption as SCaption,
  designable,
  HOC,
  startWith,
  StylableProps,
  Table as STable,
  Tbody as STbody,
  Td,
  Th,
  Thead as SThead,
  Tr,
  Tfoot as STfoot,
  withDesign,
  withoutProps,
  DesignableComponentsProps,
} from '@bodiless/fclasses';
import { flow } from 'lodash';
import React, { ComponentType, FunctionComponent, HTMLProps } from 'react';
import { withNode, withNodeKey as withNodeKeyReal } from '@bodiless/core';

enum Section {
  head = 'head',
  body = 'body',
  foot = 'foot',
}
type BRowProps = StylableProps & {
  row:string,
  section: Section,
  rowIndex: number;
};
type BCellProps = StylableProps & BRowProps & { column:string, columnIndex:number };
const DefaultRow = withoutProps('row', 'section', 'rowIndex')(Tr);
const HeadCell = withoutProps(['row', 'column', 'section', 'rowIndex', 'columnIndex'])(Th);
const BodyCell = withoutProps(['row', 'column', 'section', 'rowIndex', 'columnIndex'])(Td);
const DefaultCell = (props:BCellProps) => {
  const { section } = props;
  const Cell = section === Section.head ? HeadCell : BodyCell;
  return <Cell {...props} />;
};
// };
type TableComponents = {
  Wrapper: ComponentType<StylableProps>,
  TBody: ComponentType<StylableProps>,
  THead: ComponentType<StylableProps>,
  TFoot: ComponentType<StylableProps>,
  Row: ComponentType<BRowProps>,
  Cell: ComponentType<BCellProps>,
};
const tablComponentsStart:TableComponents = {
  Wrapper: STable,
  TBody: STbody,
  THead: SThead,
  TFoot: STfoot,
  Row: DefaultRow,
  Cell: DefaultCell,
};

type Props = {
  columns: string[],
  headRows: string[],
  footRows: string[],
  rows: string[],
} & DesignableComponentsProps<TableComponents> & HTMLProps<HTMLElement>

type TableSectionProps = {
  Wrapper: ComponentType<StylableProps>,
  Row: ComponentType<BRowProps>,
  Cell: ComponentType<BCellProps>,
  section: Section,
  columns: string[],
  rows: string[],
};
const TableSection = (props:TableSectionProps) => {
  const {
    Wrapper,
    Row,
    Cell,
    rows,
    section,
    columns,
  } = props;
  return (
    <Wrapper>
      {(rows || []).map((row, rowIndex) => (
        <Row key={row} {...{ row, rowIndex, section }}>
          {(columns || []).map((column, columnIndex) => (
            <Cell
              key={column}
              {...{
                columnIndex,
                column,
                row,
                rowIndex,
                section,
              }}
            />
          ))}
        </Row>
      ))}
    </Wrapper>
  );
};
const BTable:FunctionComponent<Props> = (props) => {
  const {
    columns,
    footRows,
    headRows,
    rows,
    components,
    ...rest
  } = props;
  const {
    Wrapper,
    TBody,
    THead,
    TFoot,
    Row,
    Cell,
  } = components;
  return (
    <Wrapper {...rest}>
      <TableSection
        {...{
          Wrapper: THead,
          Row,
          Cell,
          section: Section.head,
          rows: headRows,
          columns,
        }}
      />
      <TableSection
        {...{
          Wrapper: TBody,
          Row,
          Cell,
          section: Section.body,
          rows,
          columns,
        }}
      />
      <TableSection
        {...{
          Wrapper: TFoot,
          Row,
          Cell,
          section: Section.foot,
          rows: footRows,
          columns,
        }}
      />
    </Wrapper>
  );
};
const CleanTable = designable(tablComponentsStart, 'Table')(BTable);

type CellTransFormProps = {
  passed: BCellProps,
  hoc: HOC,
  Component: ComponentType<BCellProps>,
  func:IfCellIs,
};
class CellTransform extends React.Component<CellTransFormProps> {
  fixedProps: BCellProps;

  Component: ComponentType<BCellProps>;

  constructor(props:CellTransFormProps) {
    super(props);
    const { hoc, func, Component, passed, ...rest } = props;
    this.fixedProps = {...passed, ...rest};
    this.Component = func(passed) ? hoc(Component) : Component;
  }

  render() {
    const Component = this.Component as ComponentType<BCellProps>;
    return <Component {...this.fixedProps} />;
  }
}
type IfCellIs = (props:BCellProps) => boolean;
const ifCellIs = (func:IfCellIs) => (hoc:HOC) => (
  (Component:ComponentType<BCellProps>) => (props:BCellProps) => (
    <CellTransform
      hoc={hoc}
      func={func}
      passed={props}
      Component={Component}
    />
  ));
const ifSectionIs = (sectionWanted:Section) => (
  ifCellIs(({ section }) => section === sectionWanted)
);

type nodeKeyFunc<A> = (props:A) => any;
const withNodeKeyFunc = <A extends Props> (func:nodeKeyFunc<A>) => (
  (Component:ComponentType<A>) => (props:A) => {
    const nodeKey = func(props);
    return <Component nodeKey={nodeKey} {...props} />;
  });
const withNodeKeysTables = withDesign({
  TBody: flow(withNode, withNodeKeyReal(Section.body)),
  THead: flow(withNode, withNodeKeyReal(Section.head)),
  TFoot: flow(withNode, withNodeKeyReal(Section.foot)),
  Row: flow(withNode, withNodeKeyFunc(p => p.row)),
  Cell: flow(withNode, withNodeKeyFunc(p => p.column)),
});
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
const forCell = (sectionIn:Section) => (rowIn:string) => (columnIn:string) => (hoc:HOC) => (
  withDesign({
    Cell: ifCellIs(({ section, row, column }) => (
      (section === sectionIn) && (row === rowIn) && (column === columnIn)
    ))(hoc),
  })
);
const forCells = (func:IfCellIs) => (hoc:HOC) => withDesign({
  Cell: ifCellIs(func)(hoc),
});
export {
  withCols,
  withXRows,
  withHeadRows,
  withNodeKeysTables,
  forCells,
  CleanTable,
};
