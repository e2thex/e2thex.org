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
  startWith,
  withDesign,
  remove,
  H1,
} from '@bodiless/fclasses';
import Tout from '../Tout';
import {
  asToutHorizontal,
  asToutVertical,
  asToutNoTitle,
  asToutNoCta,
  asToutNoBody,
  asToutDefaultStyle,
  asToutOverlayTitle,
  asToutTitleSecondaryOverlay,
  asToutTitlePrimaryOverlay,
} from '../Tout/token';
import { withType } from './Categories';
import AudioPlayer from '../AudioPlayer';
import { asHeader1 } from '../Elements.token';

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
const asToutPrimary = withDesign({
  Title: flow(startWith(H1), asHeader1),
});

export const withStructureFacet = withFacet('Structure');

const bodyVariations = {
  '': withStructureFacet('With Body')(),
  NoBody: withStructureFacet('No Body')(asToutNoBody as HOC),
};
const verticalTitleVariations = 
{
  ...varyDesign({
    NormalText: withFacet('Overlay')('Normal Title Text')(asToutTitleSecondaryOverlay),
    InvertedText: withFacet('Overlay')('Inverted Title Text')(asToutTitlePrimaryOverlay),
  })({
    OverlayTitle: flow(
      withFacet('Overlay')('Title')(asToutOverlayTitle as HOC),
      withStructureFacet('With Title')(),
      withStructureFacet('With Image')()
    ),

  }),
  ...varyDesign({
    '': withFacet('Overlay')('No Overlay')(),
  },{
    '': withStructureFacet('With Title')(),
    NoTitle: withStructureFacet('No Title')(asToutNoTitle as HOC),
  })({
    '': withStructureFacet('With Image')(),
    NoImage: withStructureFacet('No Image')(asToutNoImage as HOC),
  }),
};
export const verticalVariations = varyDesign(
  {
    Vertical: withOrientationFacet('Vertical')(asToutVertical),
  },
  bodyVariations,
  verticalTitleVariations
)();
// Lets make Tout version that are Horizontal and vary the fields that are used
const horizontalVariations = varyDesign(
  {
    Horizontal: withOrientationFacet('Horizontal')(asToutHorizontal as HOC),
  },
  {
    '': withStructureFacet('With Title')(),
    NoTitle: withStructureFacet('No Title')(asToutNoTitle as HOC),
  },
  bodyVariations,
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

const primaryVariations = {
  'HeaderPrimary': withFacet('Header')('Primary')(asToutPrimary),
  '': withFacet('Header')('Secondary')(),
}

export default withDesign(varyDesign(
  baseVariation,
  orientationVariations,
  ctaVariations,
  primaryVariations,
)());
