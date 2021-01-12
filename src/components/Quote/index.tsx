import React, { FC, ComponentType, HTMLProps } from 'react';
import { flow } from 'lodash';
import {
  withDesign,
  designable,
  DesignableComponentsProps,
  Div,
  A,
  Img,
  H2,
  StylableProps,
  addProps,
  I,
  addClasses,
} from '@bodiless/fclasses';
import { withNode } from '@bodiless/core';

export type QuoteComponents = {
  Wrapper: ComponentType<StylableProps>,
  QuoteWrapper: ComponentType<StylableProps>,
  Starting: ComponentType<StylableProps>,
  Ending: ComponentType<StylableProps>,
  Quote: ComponentType<StylableProps>,
  Byline: ComponentType<StylableProps>,
};
const withText = (text) => C => props => <C {...props}>{text}</C>;
const Icon = flow(
  addClasses('material-icons'),
  withText('format_quote'),
)(I);
const quoteComponentStart:QuoteComponents = {
  Wrapper: Div,
  QuoteWrapper: Div,
  Starting: Icon,
  Quote: Div,
  Ending: Icon,
  Byline: Div,
};

type Props = DesignableComponentsProps<QuoteComponents> & HTMLProps<HTMLElement>;

const QuoteBase: FC<Props> = ({ components, ...rest }) => {
  const {
    Wrapper,
    QuoteWrapper,
    Starting,
    Quote,
    Ending,
    Byline,
  } = components;

  return (
    <Wrapper {...rest}>
      <QuoteWrapper>
        <Starting />
        <Quote />
        <Ending />
      </QuoteWrapper>
      <Byline />
    </Wrapper>
  );
};

const QuoteClean = flow(
  designable(quoteComponentStart, 'Quote'),
  withNode,
)(QuoteBase);

/**
 * Adds data- identifiers to help select tout elements in automated tests.
 *
 * @param id The id attribute to apply to the outer wrapper.
 */
const asTestableQuote = withDesign({
  Wrapper: addProps({ 'data-tout-element': 'wrapper' }),
  ImageWrapper: addProps({ 'data-tout-element': 'image-wrapper' }),
  Image: addProps({ 'data-tout-element': 'image' }),
  ImageLink: addProps({ 'data-tout-element': 'image-link' }),
  ContentWrapper: addProps({ 'data-tout-element': 'content-wrapper' }),
  Title: addProps({ 'data-tout-element': 'title' }),
  Body: addProps({ 'data-tout-element': 'body' }),
  Link: addProps({ 'data-tout-element': 'link' }),
});

export {
  QuoteClean,
  asTestableQuote,
};
