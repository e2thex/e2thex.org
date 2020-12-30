
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Img, replaceWith, stylable } from '@bodiless/fclasses';
import React, {
  HTMLProps,
  useCallback,
  useState,
  useEffect,
  ComponentType as CT,
} from 'react';
import debug from 'debug';

import {
  getUI,
  asBodilessComponent,
  BodilessOptions,
  useNode,
  AsBodiless,
  ifEditable,
} from '@bodiless/core';

import { useDropzone } from 'react-dropzone';
import { FormApi } from 'informed';
import BackendSave from './BackendSave';
import withPropsFromPlaceholder from './withPropsFromPlaceholder';
// @ts-ignore fails when it is imported by jest.
import Placeholder from './placeholder.png';
import { flow } from 'lodash';

// Type of the data used by this component.
export type Data = {
  src: string;
  alt: string;
};

// Controls the time spent on file upload
const MaxTimeout:number = 10000;

const errorLog = debug('Image');

type UploadStatusProps = HTMLProps<HTMLElement> & { statusText: string; };
export type TImagePickerUI = {
  MasterWrapper: CT<HTMLProps<HTMLElement>>,
  Wrapper: CT<HTMLProps<HTMLElement>>,
  Input: CT<HTMLProps<HTMLInputElement>>,
  UploadArea: CT<HTMLProps<HTMLElement>>,
  Uploading: CT<HTMLProps<HTMLElement>>,
  DragRejected: CT<HTMLProps<HTMLElement>>,
  UploadTimeout: CT<HTMLProps<HTMLElement>>,
  UploadFinished: CT<HTMLProps<HTMLElement>>,
  UploadStatus: CT<UploadStatusProps>,
};

const defaultImagePickerUI = {
  MasterWrapper: 'section',
  Wrapper: 'div',
  Input: 'input',
  UploadArea: () => <div>Drag a file or click here to upload.</div>,
  Uploading: () => <div>Upload is in progress</div>,
  DragRejected: () => <div>File type not accepted or too many, try again!</div>,
  UploadTimeout: () => <div>Upload failed, please try again.</div>,
  UploadFinished: () => <div>Done!</div>,
  UploadStatus: ({ statusText }: UploadStatusProps) => <div>{statusText}</div>,
};

// DropZonePlugin control the upload of file and only saves jpg/png files.
function DropZonePlugin({ formApi, targetFieldName, ui }: {
  formApi: FormApi<Data>;
  targetFieldName:string;
  ui?: Partial<TImagePickerUI>;
}) {
  const [statusText, setStatusText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadTimeout, setIsUploadingTimeout] = useState(false);
  const [isUploadFinished, setIsUploadFinished] = useState(false);
  const saveRequest = new BackendSave();
  const { node } = useNode<any>();

  useEffect(() => {
    if (isUploading) {
      const timer = setTimeout(
        () => {
          if (isUploading) {
            saveRequest.cancel('Timeout exceeded');
            formApi.setError(targetFieldName, 'Timeout exceeded');
            setIsUploadingTimeout(true);
            setIsUploading(false);
          }
        },
        MaxTimeout,
      );
      return () => clearTimeout(timer);
    }
    return () => null;
  });

  const onDrop = useCallback(acceptedFiles => {
    setIsUploading(true);
    setIsUploadFinished(false);
    setIsUploadingTimeout(false);
    setStatusText(`File "${acceptedFiles[0].name}" selected`);
    formApi.setError(targetFieldName, 'Uploading in progress');
    saveRequest.saveFile({
      file: acceptedFiles[0],
      nodePath: node.path.join('$'),
      baseResourcePath: node.baseResourcePath,
    })
      .then(({ data }) => {
        // unset errors
        formApi.setError(targetFieldName, undefined);
        formApi.setValue(targetFieldName, data.filesPath[0]);
        // formApi.validate();
        setIsUploading(false);
        setIsUploadingTimeout(false);
        setIsUploadFinished(true);
      })
      .catch(errorLog);
  }, []);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: 'audio/mpeg',
    multiple: false,
  });

  const {
    MasterWrapper,
    Wrapper,
    Input,
    UploadArea,
    Uploading,
    DragRejected,
    UploadTimeout,
    UploadFinished,
    UploadStatus,
  } = {
    ...defaultImagePickerUI,
    ...ui,
  };

  return (
    <MasterWrapper>
      <Wrapper {...getRootProps()}>
        <Input {...getInputProps()} />
        <UploadArea />
        {isDragReject && <DragRejected />}
        {isUploadTimeout && <UploadTimeout />}
        {isUploading && <Uploading />}
        {isUploadFinished && <UploadFinished />}
        <UploadStatus statusText={statusText} />
      </Wrapper>
    </MasterWrapper>
  );
}
DropZonePlugin.defaultProps = {
  ui: {},
};

// Type of the props accepted by this component.
// Exclude the src and alt from the props accepted as we write it.
type ImageProps = HTMLProps<HTMLImageElement>;
type Props = ImageProps & { ui?: TImagePickerUI};

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
        <DropZonePlugin formApi={formApi} targetFieldName="src" ui={imagePickerUI} />
      </>
    );
  },
  global: false,
  local: true,
  defaultData: {
  },
};

export const withImagePlaceholder = withPropsFromPlaceholder(['src']);

const EditDiv = props => {
  const { src } = props;
  console.log(props);
  return <div id="bob" {...props}>Audio: {src}</div>;
};
const Audio = flow(
  ifEditable(replaceWith(EditDiv)),
  asBodilessComponent(options)(),
)(AudioPlayer);

export default Audio;