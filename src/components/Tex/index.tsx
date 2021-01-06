import React, { ComponentType } from 'react';
import { flow } from 'lodash';
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

import {
  asBodilessComponent,
  ifEditable, useMenuOptionUI, useNode,
} from '@bodiless/core';
import { Div, startWith, replaceWith, Span } from '@bodiless/fclasses';
import { asEditable } from '../Elements.token';

const renderForm = () => {
  const { ComponentFormTitle, ComponentFormTextArea } = useMenuOptionUI();
  return (
    <>
      <ComponentFormTitle>Math equation</ComponentFormTitle>
      <ComponentFormTextArea field="math" />
    </>
  );
};
const options = {
  icon: 'functions',
  name: 'Tex',
  label: 'Edit',
  local: true,
  global: false,
  wrapper: 'span',
  groupLabel: 'Tex',
  renderForm,
  defaultData: { math:'5+2'},
}
const Test = props => {
  const { math } = props;
  return <Span>hi {math}</Span>
}
type AsBlock   = { block: Boolean };
const asBlock = <A extends { block:Boolean}> (Component:ComponentType<A>) => (props:A) => <Component {...props} block />;
const Math = asBodilessComponent(options)()(asBlock(TeX));

export default Math;