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
import { withFacet, withMandatoryCategories, withTitle } from '@bodiless/layouts';
import { FlowContainer } from '@bodiless/layouts-ui';
import withToutVariations from './withToutVariations';
import withRichTextVariations from './withRichTextVariations';
import withImageVariations from './withImageVariations';
import withIframeVariations from './withIframeVariations';
import withYouTubeVariations from './withYouTubeVariations';

import { asFlowContainerWithMargins } from './token';
import withAudioVariations from './withAudioVariations';
import { replaceWith, withDesign } from '@bodiless/fclasses';
import { withType } from './Categories';
import Tex from '../Tex';
import List from '../List';
import { RACI1, StandardTable } from '../RACI';
import CommonWords from '../CommonWords';


const withTables = withDesign({
  RACI1: flow(withTitle('RACI1'), withType('Custom')(replaceWith(RACI1))),
  StandardTable: flow(withTitle('Table'), withType('RichText')(replaceWith(StandardTable))),
  CommonWords: flow(withTitle('CommonWords'), withType('Custom')(replaceWith(CommonWords))),
});
// Order of includes currently dictates order in Component Picker
// thus recommend putting more frequently used components toward top for quicker access.
const FlowContainerDefault = flow(
  withRichTextVariations,
  withImageVariations,
  withToutVariations,
  asFlowContainerWithMargins,
  withIframeVariations,
  withYouTubeVariations,
  withAudioVariations,
  withTables,
  withDesign({
    Tex: flow(withTitle("Tex"), withType('Text')(replaceWith(Tex))),
    List: flow(withTitle("List"), withType("Text")(replaceWith(List))),
  }),
  withMandatoryCategories(['Orientation', 'Type']),
)(FlowContainer);

// eslint-disable-next-line import/prefer-default-export
export { FlowContainerDefault };
