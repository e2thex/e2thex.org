import React, { ComponentType } from 'react';
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

import {
  asBodilessComponent,
  useMenuOptionUI,
} from '@bodiless/core';

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
  defaultData: { math: '5+2' },
};
type AsBlockProps<A> = A & { block:Boolean };
const asBlock = <A extends object> (Component:ComponentType<A>) => (props:AsBlockProps<A>) => (
  <Component {...props} block />
);
const Math = asBodilessComponent(options)()(asBlock(TeX));

export default Math;
