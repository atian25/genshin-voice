// For more information, see https://crawlee.dev/
import { CheerioCrawler, ProxyConfiguration, Dataset } from 'crawlee';

import { router } from './routes.js';

const startUrls = ['https://wiki.biligame.com/ys/%E8%A7%92%E8%89%B2%E8%AF%AD%E9%9F%B3'];

const crawler = new CheerioCrawler({
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  requestHandler: router,
  // Comment this option to scrape the full website.
  // maxRequestsPerCrawl: 20,
});

await crawler.run(startUrls);

const dataset = await Dataset.open();
await dataset.exportToJSON('MY-DATA');
