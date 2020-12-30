/**
 * Copyright © 2019 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { flow } from 'lodash';
import {
  withFacet,
  withDesc,
  HOC,
} from '@bodiless/layouts';
import {
  varyDesign,
  extendDesign,
  replaceWith,
  withDesign,
  remove,
} from '@bodiless/fclasses';
import Tout from '../Tout';
import {
  asToutHorizontal,
  asToutVertical,
  asToutNoTitle,
  asToutNoCta,
  asToutNoBody,
  asToutNoBodyNoTitle,
  asToutDefaultStyle,
  asToutOverlayCta,
  asToutOverlayTitle,
} from '../Tout/token';
import { withType } from './Categories';
import AudioPlayer from '../AudioPlayer';
import { Fragment } from 'react';

export const withStructureFacet = withFacet('Tout Structure');
export const withOrientationFacet = withFacet('Orientation');

const baseVariation = {
  Tout: flow(
    replaceWith(Tout),
    withDesc('A way to tout a call to Action.\n'),
    withType('Tout')(asToutDefaultStyle),
  ),
};

const withAudio = withDesign({
  Link: replaceWith(AudioPlayer),
});
const asToutNoImage = withDesign({
  Image: remove,
});
// Lets make Tout version that are Vertical and vary the fields that are used
const verticalVariations = varyDesign(
  {
    Vertical: withOrientationFacet('Vertical')(asToutVertical as HOC),
  },
  {
    ...varyDesign({
      '': withFacet('Overlay')('No Overlay')(),
      OverlayTitle: withFacet('Overlay')('Title')(asToutOverlayTitle as HOC),

    })({
      '': withStructureFacet('With Title')(),
    }),
    NoTitle: withStructureFacet('No Title')(asToutNoTitle as HOC),
  },
  {
    '': withStructureFacet('With Body')(),
    NoBody: withStructureFacet('No Body')(asToutNoBody as HOC),
  },
  {
    '': withStructureFacet('With Image')(),
    NoImage: withStructureFacet('No Image')(asToutNoImage as HOC),
  },
);
// Lets make Tout version that are Horizontal and vary the fields that are used
const horizontalVariations = varyDesign(
  {
    Horizontal: withOrientationFacet('Horizontal')(asToutHorizontal as HOC),
  },
  {
    '': withStructureFacet('With Title')(),
    NoTitle: withStructureFacet('No Title')(asToutNoTitle as HOC),
  },
  {
    '': withStructureFacet('With Body')(),
    NoBody: withStructureFacet('No Body')(asToutNoBody as HOC),
  },
);
// LEts combine the Vertical and Horizontal
const orientationVariations = extendDesign(
  horizontalVariations,
  verticalVariations,
);

const ctaVariations = {
  '': withStructureFacet('With CTA')(),
  NoCTA: withStructureFacet('No CTA')(asToutNoCta as HOC),
  WithAudio: withStructureFacet('with Audio CTA')(withAudio),
};

export default withDesign(varyDesign(
  baseVariation,
  orientationVariations,
  ctaVariations,
)());
