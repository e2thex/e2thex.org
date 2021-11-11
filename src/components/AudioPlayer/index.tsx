import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { stylable } from '@bodiless/fclasses';
import React from 'react';

import {
  getUI,
  asBodilessComponent,
  BodilessOptions,
} from '@bodiless/core';

// @ts-ignore fails when it is imported by jest.
import { flow } from 'lodash';
import DropZonePlugin from './DropZonePlugin';
// Type of the props accepted by this component.
// Exclude the src and alt from the props accepted as we write it.

type Props = {
  ui: any
};
// Type of the data used by this component.
export type Data = {
  src: string;
};

// Options used to create an edit button.
const options: BodilessOptions<Props, Data> = {
  icon: 'audiotrack',
  label: 'Select',
  groupLabel: 'Audio',
  name: 'audio',
  renderForm: ({ ui: formUi, formApi, componentProps }) => {
    const { ui: imagePickerUI } = componentProps;
    const { ComponentFormTitle, ComponentFormLabel, ComponentFormText } = getUI(formUi);
    return (
      <>
        <ComponentFormTitle>Audio</ComponentFormTitle>
        <ComponentFormLabel htmlFor="image-src">Src</ComponentFormLabel>
        <ComponentFormText field="src" id="image-src" />
        <DropZonePlugin formApi={formApi} targetFieldName="src" ui={imagePickerUI} acceptType="audio/mpeg" />
      </>
    );
  },
  global: false,
  local: true,
  Wrapper: 'div',
};

const Audio = flow(
  asBodilessComponent(options)(),
  stylable,
)(AudioPlayer);

export default Audio;
