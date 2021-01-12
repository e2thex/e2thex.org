import {
  asGatsbyImage as asBaseGatsbyImage,
  withGatsbyImageNode,
  withGatsbyImageLogger,
  GatsbyImagePresets,
} from '@bodiless/gatsby-theme-bodiless';
import { asBodilessImage } from '@bodiless/components-ui';
import { flowRight } from 'lodash';
import { withNodeKey } from '@bodiless/core';
// import { Img } from '@bodiless/fclasses';
const asGatsbyImg = (preset: string) => (nodeKey) => flowRight(
  withNodeKey(nodeKey),
  withGatsbyImageNode(preset),
  asBodilessImage(),
  withGatsbyImageLogger(preset),
  asBaseGatsbyImage,
);
const asGatsbyImage = asGatsbyImg(GatsbyImagePresets.FluidWithWebp);
// const GatsbyImg = asGatsbyImage()(Img);
/// export default GatsbyImg;

export default asGatsbyImage;
export { asGatsbyImage };
