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
import { addClasses, removeClasses } from '@bodiless/fclasses';
import {
  asBodilessLink,
  asEditable as asEditableCore,
} from '@bodiless/components';
// import { asBodilessImage } from '@bodiless/components-ui';
import {
  asResponsive21By9Embed,
  asResponsive16By9Embed,
  asResponsive4By3Embed,
  asResponsive1By1Embed,
} from '@bodiless/organisms';
import { asGatsbyImage as asBodilessImage } from './GastbyImage';
import {
  asAlignCenter,
  asAlignRight,
  asAlignLeft,
  asUnderline,
  asAlignJustify,
} from './ElementDefault.token';
import { WithNodeKeyProps } from '@bodiless/core';

/* Page Structure */
const asBlockItem = addClasses('p-1 w-full');
const asPageContainer = addClasses('container md:mx-auto mx-1');
const asXMargin = addClasses('mx-2');
const asYMargin = addClasses('my-2');
const asNegXMargin = addClasses('-mx-1');
const asNegYMargin = addClasses('-my-1');
const withPadding1 = addClasses('p-1');
const withPadding3 = addClasses('p-3');
const withPadding5 = addClasses('p-5');

/* Responsive design */
const asMobileOnly = addClasses('lg:hidden');
const asDesktopOnly = flow(
  addClasses('hidden lg:flex justify-end'),
  removeClasses('flex'),
);

/* Primary coloring */
const asPrimaryColorBackground = addClasses('bg-black');
const asTextColorPrimary = addClasses('text-white');
const asSecondaryColorBackground = addClasses('bg-gray-300');
const asTextColorSecondary = addClasses('text-black');
const asPrimaryColorBackgroundOnHover = addClasses('hover:bg-gray-600');
const asTextColorPrimaryOnHover = addClasses('hover:text-white');
const asOverlay = addClasses('bg-opacity-50 p-2 rounded');
const asPrimaryOverlay = flow(asPrimaryColorBackground, asTextColorPrimary, asOverlay);
const asSecondaryOverlay = flow(asSecondaryColorBackground, asTextColorSecondary, asOverlay);
/* Coloring */

const asTextWhite = addClasses('text-white');
const asTealBackground = addClasses('bg-teal-600');
const asLightTealBackground = addClasses('bg-teal-500');
const asLightTealBackgroundOnHover = addClasses('hover:bg-teal-500');

/* Typography */
const asBold = addClasses('font-bold');
const asItalic = addClasses('italic');
const asLink = addClasses('text-blue-700 underline');
const asActiveMenuLink = flow(asBold, addClasses('bg-teal-500'));
const asStrikeThrough = addClasses('');
const asSuperScript = addClasses('');

const asHeader1 = flow(addClasses('text-3xl'), asTextColorSecondary);
const asHeader2 = flow(addClasses('text-2xl my-4 bg-gradient-to-t from-gray-100 p-1 via-transparent border-b font-bold'));
const asHeader3 = addClasses('text-xl');

/* BlockQuote */
const asBlockQuote = addClasses('block mx-4');

/* Image component */
const asImage = addClasses('');
const asEditableImage = asBodilessImage;
const asImageRounded = addClasses('rounded-t-lg');

/* Link component */
const asEditableLink = asBodilessLink;

/* Edit component */
const asEditable = (nodeKeys?: WithNodeKeyProps, placeholder?: string) => asEditableCore(
  nodeKeys,
  placeholder,
  // Overrides to add auto-superscript.
  () => ({
    sanitizer: (html: string) => html
      .split('')
      .map(c => ('©'.includes(c) ? `<sup>${c}</sup>` : c))
      .join(''),
  }),
);

// Tout Components
const asCta = flow(addClasses('text-center p-2'), asPrimaryColorBackground, asPrimaryColorBackgroundOnHover, asTextColorPrimary);

/* Utility Classes */
const asDisabled = addClasses('pointer-events-none');

export {
  asBold,
  asItalic,
  asUnderline,
  asLink,
  asActiveMenuLink,
  asStrikeThrough,
  asAlignLeft,
  asAlignRight,
  asAlignCenter,
  asAlignJustify,
  asHeader1,
  asHeader2,
  asHeader3,
  asCta,
  asDisabled,
  asBlockItem,
  asPageContainer,
  asPrimaryColorBackground,
  asSecondaryColorBackground,
  asTealBackground,
  asLightTealBackground,
  asLightTealBackgroundOnHover,
  asImage,
  asEditableImage,
  asEditableLink,
  asEditable,
  asImageRounded,
  asMobileOnly,
  asDesktopOnly,
  asSuperScript,
  asTextColorPrimary,
  asTextWhite,
  asXMargin,
  asYMargin,
  asNegXMargin,
  asNegYMargin,
  asBlockQuote,
  withPadding1,
  withPadding3,
  withPadding5,
  asResponsive21By9Embed,
  asResponsive16By9Embed,
  asResponsive4By3Embed,
  asResponsive1By1Embed,
  asPrimaryColorBackgroundOnHover,
  asTextColorSecondary,
  asTextColorPrimaryOnHover,
  asSecondaryOverlay,
  asPrimaryOverlay,
};
