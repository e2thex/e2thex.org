import {
  stylable, addClasses, Button, designable, DesignableComponentsProps, Div, Form as FForm, StylableProps, Tbody, Textarea, Thead, withDesign,
} from '@bodiless/fclasses';
import { flow } from 'lodash';
import React, { ComponentType, HTMLProps, FunctionComponent as FC, useContext, createContext, useState } from 'react';
import { withContent, CleanTable, forCells } from '../Tables';
import { Result, rssResultPromise, result, overrideResults } from './commonWord';

export type CwComponents = {
  Wrapper: ComponentType<StylableProps>,
  Form: ComponentType<StylableProps>,
  Input: ComponentType<StylableProps>,
  InputText: ComponentType<StylableProps>,
  Submit: ComponentType<StylableProps>,
  Results: ComponentType<StylableProps>,
};
const cwComponentStart:CwComponents = {
  Wrapper: Div,
  Form: FForm,
  Input: Textarea,
  InputText: Textarea,
  Submit: Button,
  Results: stylable(CleanTable),
};

type Props = DesignableComponentsProps<CwComponents> & HTMLProps<HTMLElement>;

const CwBase: FC<Props> = ({ components, ...rest }) => {
  const {
    Wrapper,
    Form,
    Input,
    InputText,
    Submit,
    Results,
  } = components;

  return (
    <Wrapper {...rest}>
      <Form>
        <Input />
        <InputText />
        <Submit>Process</Submit>
      </Form>
      <Results />
    </Wrapper>
  );
};

const CwClean = flow(
  designable(cwComponentStart, 'Cw'),
)(CwBase);

const placeholder = `http://www.ams.org/rss/conm.rss
https://www.phase2technology.com/feed
https://www.reddit.com/.rss
http://rss.cnn.com/rss/cnn_topstories.rss
https://critter.blog/feed/ `;
const others = `

https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml
http://rss.cnn.com/rss/cnn_topstories.rss
https://www.reddit.com/r/HomeImprovement/.rss
https://www.reddit.com/r/science/.rss
https://www.sup.org/rss/?feed=newbooks
https://www.phase2technology.com/feed
https://law.stanford.edu/blog/human-rights-center/feed/
http://www.nationalreview.com/rss.xml`;


const ResultsContext = createContext([] as Result[]);
const UpdateResultsContext = createContext((a:Result[]) => null);
const asWrapper = (C) => (props) => {
  const [data, update] = useState([] as Result[]);
  return (
    <ResultsContext.Provider value={data}>
      <UpdateResultsContext.Provider value={update}>
        <C {...props} />
      </UpdateResultsContext.Provider>
    </ResultsContext.Provider>
  );
};
const asTextArea = (C) => (props) => {
  return <><label for="urls">RSS URLs:</label><C id="urls" placeholder={placeholder} {...props} /></>;
};
const asTextAreaText = (C) => (props) => {
  return <><label for="text">Prose:</label><C id="text" placeholder="Paste prose here" {...props} /></>;
};

const idInResults = (results:Result[]) => (id:string) => (
  results.map(r => r.id).includes(id)
);
const idNotInResults = (results:Result[]) => (id:string) => !idInResults(results)(id); 
const withSubmit = (C) => (props) => {
  const update = useContext(UpdateResultsContext);
  const data = useContext(ResultsContext);
  const submit = (event:Event) => {
    event.preventDefault();
    event.stopPropagation();
    const urlFromUserRaw = document.getElementById('urls').value || '';
    const urlFromUser = urlFromUserRaw.trim().split('\n').map(s => s.trim()) as string[];
    const urlFromPlaceholders = placeholder.split('\n');
    const urlCandidates =[...urlFromUser, ...urlFromPlaceholders].filter(v => v.length > 0);
    const urlsToProcess = urlCandidates.filter(idNotInResults(data));
    Promise.all(urlsToProcess.map(rssResultPromise)).then(results => {
      const textValue = document.getElementById('text').value;
      const textResult = textValue ? [result(textValue, 'Prose Entered', 'text')] : [] as Result[];
      const newResults = overrideResults(data)([...results, ...textResult])

      update(newResults.sort((a, b) => b.cheap - a.cheap));
    }).catch(err => console.log(err));
  };
  return <C {...props} onClick={submit} />;
};
const Row = (props) => {
  const { title, cheap, expensive, total, fk } = props;

  return (
    <tr>
      <th className="text-left">{title}</th>
      <td className="text-center">{cheap.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 })}</td>
      <td className="text-center">{expensive.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 })}</td>
      <td className="text-center">{total}</td>
      <td className="text-center">{(expensive * 5 + cheap * 0.5).toLocaleString(undefined, { minimumFractionDigits: 2, style: 'currency', currency: 'USD' })}</td>
      <td className="text-center">{fk}</td>
    </tr>
  )
}
const asData = (C) => (props) => {
  const data = useContext(ResultsContext);
  const head = [[
    'Feed',
    'Cheap',
    'Expensive',
    'Total Words',
    'Cost per word',
    'FK Grade Level',
  ]];
  const body = data.map(d => [
    d.title,
    d.cheap.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 }),
    d.expensive.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 }),
    d.total.toString(),
    (d.expensive * 5 + d.cheap * 0.5).toLocaleString(undefined, { minimumFractionDigits: 2, style: 'currency', currency: 'USD' }).toString(),
    d.fk.toString(),
  ]);
  const Component = withContent({ body, head })(C);
  return <Component {...props} />;
};

const CommonWords = withDesign({
  Input: flow(asTextArea, addClasses('w-full rounded border h-10')),
  InputText: flow(asTextAreaText, addClasses('w-full rounded border h-10')),
  Submit: flow(withSubmit, addClasses('w-full border hover:by-gray-300 bg-gray-100 rounded b-1')),
  Wrapper: asWrapper,
  Results: flow(
    asData,
    withDesign({
      Wrapper: addClasses('w-full border'),
      THead: flow(addClasses('bg-gray-200')),
      Cell: addClasses('text-center'),
    }),
    forCells(({ columnIndex, section }) => columnIndex % 2 === 1 && section === 'body')(addClasses('bg-gray-100')),
  ),
})(CwClean);
export default CommonWords;
