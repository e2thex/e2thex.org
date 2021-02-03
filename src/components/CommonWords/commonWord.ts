import Parser from 'rss-parser';
import syllable from 'syllable';
import fleschKincaidA from 'flesch-kincaid';
import getWords from 'get-words';
import { extract as getSentences } from 'sentence-extractor';
import c5000 from './5000.json';

const words = (text:string) => getWords(text) as string[];
const sentences = (text:string) => text.split(/[?!.]\s/) as string[];
const syllableCount = (text:string) => words(text).map(syllable).reduce((a, b) => a + b, 0);

const isFiftyCentWord = (word:string) => c5000.includes(word);
const isFiveDollarWord = (word:string) => !c5000.includes(word);
type Result = {
  title: string
  cheap: number,
  expensive: number,
  total: number,
  fk: number
  id: string,
};
type RssResultPromise = (url:string) => Promise<Result>;
const fleschKincaid = (data:string) => {
  const totalWords = words(data).length;
  const totalSentences = sentences(data).length;
  const totalSymbol = syllableCount(data);
  console.log({
    sentence: totalSentences,
    word: totalWords,
    syllable: totalSymbol,
  });
  return Math.round(fleschKincaidA({
    sentence: totalSentences,
    word: totalWords,
    syllable: totalSymbol,
  })) as number;
};

const result = (text:string, title:string, id:string) => {
  const total = words(text).length;
  const cheap = words(text).filter(isFiftyCentWord).length / total;
  const expensive = 1 - cheap;
  return {
    title,
    cheap,
    expensive,
    total,
    fk: fleschKincaid(text),
    id,
  };
};
const idInResults = (results:Result[]) => (id:string) => (
  results.map(r => r.id).includes(id)
);
const idNotInResults = (results:Result[]) => (id:string) => !idInResults(results)(id); 
const resultInResults = (results:Result[]) => (r:Result) => (
  results.map(r => r.id).includes(r.id)
);
const resultNotInResults = (results:Result[]) => (r:Result) => !resultInResults(results)(r);
const overrideResults = (prevResults:Result[]) => (results:Result[]) => (
  [...prevResults.filter(resultNotInResults(results)), ...results]
);
const rssResultPromise:RssResultPromise = (url) => new Promise((resolve, reject) => {
  const parser = new Parser();
  const CORS_PROXY = 'https://thingproxy.freeboard.io/fetch/';
  const processUrl = (u: string) => `${CORS_PROXY}${u}`;
  parser.parseURL(processUrl(url), (err, feed) => {
    if (err) {
      reject(err);
      return;
    }
    let data = '';
    feed.items.forEach((entry) => {
      const content = entry['content:encodedSnippet'] || entry.contentSnippet;
      data = `${data} ${content}`;
    });
    resolve(result(data, feed.title || 'No Title', url) as Result);
  });
});
export {
  result,
  Result,
  rssResultPromise,
  overrideResults,
};