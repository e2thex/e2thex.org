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
  addClasses,
  withDesign,
  remove,
} from '@bodiless/fclasses';
import {
  asToutVertical as asBToutVertical,
  asToutHorizontal as asBToutHorizontal,
  asToutNoTitle,
  asToutNoBody,
  asToutNoCta,
  asToutOverlayTitle,
  asToutOverlayCta,
  asToutNoBodyNoTitle,
} from '@bodiless/organisms';
import {
  asImageRounded,
  asCta,
  asHeader2,
  asBlockItem,
  asTextColorSecondary,
  asPrimaryOverlay,
  asSecondaryOverlay,
  asXMargin,
} from '../Elements.token';

const asToutHorizontal = flow(
  withDesign({
    Title: asXMargin,
    Body: asXMargin,
    Image: addClasses('rounded-l-lg'),
    Link: addClasses('rounded-r'),
  }),
  asBToutHorizontal,
);
const asToutVertical = flow(
  withDesign({
    Title: addClasses(''),
    Body: addClasses(''),
    Link: addClasses('rounded-b')
  }),
  asBToutVertical,
);

const asToutDefaultStyle = withDesign({
  Wrapper: asTextColorSecondary,
  Image: asImageRounded,
  Title: addClasses('text-2xl'),
  Link: asCta,
});

const asToutWithPaddings = withDesign({
  Wrapper: asBlockItem,
});

const asToutTextWhite = withDesign({
  ContentWrapper: addClasses('text-white'),
});

const asToutMainMenu = flow(
  asToutTextWhite,
  asToutWithPaddings,
  asToutDefaultStyle,
  asToutHorizontal,
);
const asToutNoImage = withDesign({
  Image: remove,
});
const asToutTitlePrimaryOverlay = withDesign({
  Title: asPrimaryOverlay,
});
const asToutTitleSecondaryOverlay = withDesign({
  Title: asSecondaryOverlay,
});

export {
  asToutHorizontal,
  asToutVertical,
  asToutNoTitle,
  asToutNoBody,
  asToutNoCta,
  asToutDefaultStyle,
  asToutOverlayTitle,
  asToutOverlayCta,
  asToutNoBodyNoTitle,
  asToutWithPaddings,
  asToutTextWhite,
  asToutMainMenu,
  asToutNoImage,
  asToutTitlePrimaryOverlay,
  asToutTitleSecondaryOverlay,
};
