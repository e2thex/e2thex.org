import Parser from 'rss-parser';
import c5000 from './5000.json';

enum Commonness {
  high='high',
  normal='normal',
  low='low',
}
const commonness = (word:string) => (
  c5000.includes(word) ? Commonness.high : Commonness.low
)

const pullWordCandidates = (data:string) => data.split(/( |\n|\r)/);

type Histo = {
  [index:string] : number,
};
const histoObj = (items:string[]) => (
  items
    .reduce((acc, i) => ({...acc, [i]: (acc[i] || 0 ) + 1}),{} as Histo)
)
type HistoItem = {
  key:string,
  value:number,
}
type AlterFunc = (key: string, value: number, histo: Histo) => number
type HistoMapFunc = (h:Histo, f:AlterFunc) => Histo
const histoMap:HistoMapFunc = (histo, func) => (
  Object.keys(histo)
    .reduce((acc, key) => ({ ...acc, [key]: func(key, histo[key], histo) }), {} as Histo)
);
const histoTotal = (histo:Histo) => Object.keys(histo).reduce((c,i) => c + histo[i], 0);

const histoPercent:AlterFunc = (key, value, histo) => (
  value / histoTotal(histo)
);

type Result = {
  title: string
  [Commonness.high]: number,
  [Commonness.low]: number,
  total: number,
  feedUrl: string,
};
const cleanUpWord = (word:string) => (word
  .replace(/[^a-zA-Z\s-'’]/g, '')
  .trim()
  .toLowerCase()
);
type RssResultPromise = (url:string) => Promise<Result>
const rssResultPromise:RssResultPromise = (url) => new Promise((resolve, reject) => {
  const parser = new Parser();
  
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
  parser.parseURL(`${CORS_PROXY}${url}`, (err, feed) => {
    if (err) {
      reject(err);
      return;
    }
    let data = '';
    feed.items.forEach((entry) => {
      // console.log(Object.keys(entry));
      const content = entry['content:encodedSnippet'] || entry.contentSnippet;
      data = `${data} ${content}`;
    });
    const words = pullWordCandidates(data).map(cleanUpWord);
    const output = histoMap(histoObj(words.map(commonness)), histoPercent);
    const result = {
      title: feed.title,
      [Commonness.high]: output[Commonness.high],
      [Commonness.low]: output[Commonness.low],
      total: words.length,
      feedUrl: feed.feedUrl,
    };
    resolve(result as Result);
  });
});
export {
  commonness,
  Commonness,
  pullWordCandidates,
  rssResultPromise,
  Result,
};
