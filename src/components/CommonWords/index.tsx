import {
  addClasses, Button, designable, DesignableComponentsProps, Div, Form as FForm, StylableProps, Table, Tbody, Textarea, Thead, withDesign,
} from '@bodiless/fclasses';
import { flow, toString } from 'lodash';
import React, { ComponentType, HTMLProps, FunctionComponent as FC, useContext, createContext, useState } from 'react';
import { Result, rssResultPromise } from './commonWord';

export type CwComponents = {
  Wrapper: ComponentType<StylableProps>,
  Form: ComponentType<StylableProps>,
  Input: ComponentType<StylableProps>,
  Submit: ComponentType<StylableProps>,
  Results: ComponentType<StylableProps>,
  Header: ComponentType<StylableProps>,
  Data: ComponentType<StylableProps>,
};
const cwComponentStart:CwComponents = {
  Wrapper: Div,
  Form: FForm,
  Input: Textarea,
  Submit: Button,
  Results: Table,
  Header: Thead,
  Data: Tbody,
};

type Props = DesignableComponentsProps<CwComponents> & HTMLProps<HTMLElement>;

const CwBase: FC<Props> = ({ components, ...rest }) => {
  const {
    Wrapper,
    Form,
    Input,
    Submit,
    Results,
    Header,
    Data,
  } = components;

  return (
    <Wrapper {...rest}>
      <Form>
        <Input />
        <Submit>Process</Submit>
      </Form>
      <Results>
        <Header>
          <tr>
            <th>Feed</th>
            <th>Cheap</th>
            <th>Expensive</th>
            <th>Total Words</th>
            <th>Cost per word</th>
          </tr>
        </Header>
        <Data />
      </Results>
    </Wrapper>
  );
};

const CwClean = flow(
  designable(cwComponentStart, 'Cw'),
)(CwBase);

const placeholder = `http://www.ams.org/rss/conm.rss
https://www.phase2technology.com/feed
https://critter.blog/feed/ `;
const others = `

https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml
http://rss.cnn.com/rss/cnn_topstories.rss
https://www.reddit.com/r/HomeImprovement/.rss
https://www.reddit.com/r/science/.rss
https://www.reddit.com/.rss
https://www.sup.org/rss/?feed=newbooks
https://www.phase2technology.com/feed
https://law.stanford.edu/blog/human-rights-center/feed/
http://www.nationalreview.com/rss.xml`;


const ResultsContext = createContext([] as Result[]);
const UpdateResultsContext = createContext((a:Result[]) => null);
const asResults = (C) => (props) => {
  const url = placeholder.split('\n');
  const data = rssResultPromise
}
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
;
  return <C id="urls" placeholder={placeholder} {...props} />;
};

const withSubmit = (C) => (props) => {
  const update = useContext(UpdateResultsContext);
  const data = useContext(ResultsContext);
  const submit = (event:Event) => {
    event.preventDefault();
    event.stopPropagation();
    const raw = document.getElementById('urls').value;
    const notProcessedYet = (url:string) => !data.map(i => i.feedUrl).includes(url);
    const urls = [...raw.trim().split('\n'), ...placeholder.split('\n')]
      .map(i => i.trim())
      .filter(v => v.length > 0)
      .filter(notProcessedYet);
    const rolloverData = data.filter(i => {
      const r = i.feedUrl && !urls.includes(i.feedUrl.trim());
      console.log(urls);
      console.log(i);
      console.log(`${i.feedUrl} ${r}`);
      return r;
    });
    console.log(urls);
    console.log(rolloverData);
    Promise.all(urls.map(rssResultPromise)).then(results => {
      update([...rolloverData, ...results].sort((a, b) => b.high - a.high));
      console.log(results.sort((a, b) => b.high - a.high));
    }).catch(err => console.log(err));
  };
  return <C {...props} onClick={submit} />;
};
const Row = (props) => {
  const { title, high, low, total, components } = props;
  return (
    <tr>
      <th className="text-left">{title}</th>
      <td className="text-center">{high.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 })}</td>
      <td className="text-center">{low.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 })}</td>
      <td className="text-center">{total}</td>
      <td className="text-center">{(low * 5 + high * 0.5).toLocaleString(undefined, { minimumFractionDigits: 2, style: 'currency', currency: 'USD' })}</td>
    </tr>
  )
}
const asData = (C) => (props) => {
  const data = useContext(ResultsContext);
  console.log(data);
  return (
    <C {...props}>
      {data.map(d => <Row key={d.title} {...d} />)}
    </C>
  );
};

const CommonWords = withDesign({
  Input: flow(asTextArea, addClasses('w-full rounded border h-10')),
  Submit: flow(withSubmit, addClasses('w-full border hover:by-gray-300 bg-gray-100 rounded b-1')),
  Wrapper: asWrapper,
  Data: asData,
  Results: addClasses('w-full border'),
})(CwClean);
export default CommonWords;
