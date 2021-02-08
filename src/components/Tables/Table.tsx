import React, { FunctionComponent } from 'react';
import {
  designable,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  withoutProps,
} from '@bodiless/fclasses';
import {
  CellProps,
  Section,
  TableProps,
  TableSectionProps,
  TableComponents,
} from './types';

const DefaultRow = withoutProps('row', 'section', 'rowIndex')(Tr);
const withoutCellProps = withoutProps(['row', 'column', 'section', 'rowIndex', 'columnIndex']);
const HeadCell = withoutCellProps(Th);
const BodyCell = withoutCellProps(Td);
const DefaultCell = (props:CellProps) => {
  const { section } = props;
  const Cell = section === Section.head ? HeadCell : BodyCell;
  return <Cell {...props} />;
};
const tablComponentsStart:TableComponents = {
  Wrapper: Table,
  TBody: Tbody,
  THead: Thead,
  TFoot: Tfoot,
  Row: DefaultRow,
  Cell: DefaultCell,
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

const TableBase:FunctionComponent<TableProps> = (props) => {
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
const CleanTable = designable(tablComponentsStart, 'Table')(TableBase);

export default CleanTable;
