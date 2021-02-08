import { DesignableComponentsProps, StylableProps } from '@bodiless/fclasses';
import { ComponentType, HTMLProps } from 'react';

enum Section {
  head = 'head',
  body = 'body',
  foot = 'foot',
}

type RowProps = StylableProps & {
  row:string,
  section: Section,
  rowIndex: number;
};
type CellProps = StylableProps & RowProps & { 
  column:string,
  columnIndex:number
};

type TableComponents = {
  Wrapper: ComponentType<StylableProps>,
  TBody: ComponentType<StylableProps>,
  THead: ComponentType<StylableProps>,
  TFoot: ComponentType<StylableProps>,
  Row: ComponentType<RowProps>,
  Cell: ComponentType<CellProps>,
};

type TableBaseProps = {
  columns: string[],
  headRows: string[],
  footRows: string[],
  rows: string[],
};
type TableProps = TableBaseProps
& DesignableComponentsProps<TableComponents> & HTMLProps<HTMLElement>;

type TableSectionProps = {
  Wrapper: ComponentType<StylableProps>,
  Row: ComponentType<RowProps>,
  Cell: ComponentType<CellProps>,
  section: Section,
  columns: string[],
  rows: string[],
};

export {
  Section,
  RowProps,
  CellProps,
  TableProps,
  TableSectionProps,
  TableComponents,
  TableBaseProps,
};
