import { asBodilessComponent, useMenuOptionUI } from '@bodiless/core';
import { Fragment } from '@bodiless/fclasses';
import { ComponentFormText, Span } from '@bodiless/ui';
import { flow } from 'lodash';
import React from 'react';
const HighlightSpan = (p) => (<Span className="bg-yellow-500" {...p} />)
const HighlightDisplay = (props) => {
  const { hid, children, ...rest } = props;
  // const Wrapper = (window.location.hash === `#${hid}`)
  const Wrapper = false
    ? HighlightSpan
    : Span;
  return (
    <>
      <a id={hid} />
      <Wrapper {...rest}>
        {children}
      </Wrapper>
    </>
  )
}
const renderForm = () => {
  const { ComponentFormTitle, ComponentFormText } = useMenuOptionUI();
  return (
    <>
      <ComponentFormTitle>Highlight Id</ComponentFormTitle>
      <ComponentFormText field="hid" />
    </>
  );
};
const options = {
  icon: 'highlight',
  name: 'aHighlight',
  label: 'Edit',
  local: true,
  global: false,
  wrapper: 'span',
  groupLabel: 'aHighlight',
  renderForm,
  defaultData: { hid: 'test' },
};
 // const Highlight = asBodilessComponent(options)()(HighlightDisplay);
// const Highlight = asBodilessComponent(options)()(Span);
const Highlight = HighlightDisplay;
export {
  Highlight
}