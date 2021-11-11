/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import { asBodilessComponent, ifEditable, useMenuOptionUI } from '@bodiless/core';
import { addClasses, Span } from '@bodiless/fclasses';
import React, {
  HTMLProps,
  FunctionComponent,
  useState, useEffect,
} from 'react';

const HighlightSpan = <A extends Object> (p:A) => (<Span className="bg-yellow-500" {...p} />);
type Props = {
  hid: string,
} & HTMLProps<HTMLElement>;
const HighlightDisplay:FunctionComponent<Props> = (props) => {
  const { hid, children, ...rest } = props;
  const [hashMatch, setHashMatch] = useState(false);
  useEffect(() => {
    window.addEventListener('hashchange', () => {
      const newHashMatch = window.location.hash === `#${hid}`;
      if (newHashMatch !== hashMatch) setHashMatch(newHashMatch);
    });
  });
  const Wrapper = hashMatch
    ? HighlightSpan
    : Span;
  return (
    <>
      <a id={hid} />
      <Wrapper {...rest}>
        {children}
      </Wrapper>
    </>
  );
};
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
// const editBG = ifEditable(addClasses('bg-grey-200'));
const editBG = ifEditable(addClasses('bg-gray-200'));
const Highlight = asBodilessComponent(options)('high')(editBG(HighlightDisplay));
export default Highlight;
