import {
  asGatsbyImage as asBaseGatsbyImage,
  withGatsbyImageNode,
  withGatsbyImageLogger,
  GatsbyImagePresets,
} from '@bodiless/gatsby-theme-bodiless';
import { asBodilessImage } from '@bodiless/components-ui';
import { flowRight } from 'lodash';
import { Img } from '@bodiless/fclasses';

const asGatsbyImg = (preset: string) => props => flowRight(
  withGatsbyImageNode(preset),
  asBodilessImage(props),
  withGatsbyImageLogger(preset),
  asBaseGatsbyImage,
);
const asGatsbyImage = asGatsbyImg(GatsbyImagePresets.FluidWithWebp);
const GatsbyImg = asGatsbyImage()(Img);
export default GatsbyImg;
export { asGatsbyImage };
