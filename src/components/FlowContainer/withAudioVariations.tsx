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
  addClasses
} from '@bodiless/fclasses';
import Tout from '../Tout';
import {
  asToutVertical,
  asToutNoTitle,
  asToutNoBody,
  asToutDefaultStyle,
  asToutOverlayTitle,
  asToutTitleSecondaryOverlay,
  asToutTitlePrimaryOverlay,
  asToutNoImage,
} from '../Tout/token';
import { withType } from './Categories';
import AudioPlayer from '../AudioPlayer';
import { asYMargin } from '../Elements.token';

export const withStructureFacet = withFacet('Structure');

const withAudio = withDesign({
  Link: flow(
    replaceWith(AudioPlayer),
    
    asYMargin,
    ),
});
const baseVariation = {
  Audio: flow(
    replaceWith(Tout),
    withDesc('A way to tout a call to Action.\n'),
    withType('Audio')(asToutDefaultStyle, withAudio, asToutVertical),
  ),
};
const bodyVariations = {
  '': withStructureFacet('With Body')(),
  NoBody: withStructureFacet('No Body')(asToutNoBody as HOC),
};
const titleVariations = 
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
export const VerticalVariations = varyDesign(
  bodyVariations,
  titleVariations
)();

export default withDesign(varyDesign(
  baseVariation,
  bodyVariations,
  titleVariations,
)());
