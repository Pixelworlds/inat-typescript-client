import { binary, command, flag, option, optional, positional, run, string } from 'cmd-ts';
import { log } from 'crawlee';
import { INaturalistAPICrawlerCheerio } from '../crawler/inat-api-crawler-cheerio';

const crawler = new INaturalistAPICrawlerCheerio();

const crawl = async (url: string) => {
  await crawler.crawlOne(url);
};

const crawlMany = async (urls: string[]) => {
  await crawler.crawl(urls);
};

const cmd = binary(
  command({
    name: 'crawl',
    description: 'Crawl iNaturalist API documentation',
    args: {
      url: positional({
        type: optional(string),
        description: 'The URL to crawl (defaults to iNaturalist API reference)',
      }),
      urls: option({
        type: optional(string),
        long: 'urls',
        short: 'u',
        description: 'Comma-separated list of URLs to crawl',
      }),
      debug: flag({
        long: 'debug',
        short: 'd',
        description: 'Enable debug mode',
      }),
    },
    handler: async ({ url, urls, debug, cheerio }) => {
      if (debug) {
        process.env.DEBUG = 'true';
        log.setLevel(log.LEVELS.DEBUG);
        console.log('Debug mode enabled');
      }

      if (cheerio) {
        console.log('Using Cheerio crawler for better network reliability');
      }

      process.on('SIGINT', () => {
        console.log('Received SIGINT, forcing exit...');
        process.exit(0);
      });

      process.on('SIGTERM', () => {
        console.log('Received SIGTERM, forcing exit...');
        process.exit(0);
      });

      try {
        if (urls) {
          const urlList = urls
            .split(',')
            .map(u => u.trim())
            .filter(u => u.length > 0);

          if (urlList.length === 0) {
            console.error('Error: No valid URLs provided');
            process.exit(1);
          }

          console.log(`Crawling ${urlList.length} URLs`);
          await crawlMany(urlList, cheerio);
        } else {
          const targetUrl = url || 'https://www.inaturalist.org/pages/api+reference';
          console.log(`Crawling iNaturalist API documentation: ${targetUrl}`);
          await crawl(targetUrl, cheerio);
        }

        console.log('Crawl completed successfully');
      } catch (err) {
        console.error('Crawl failed:', err);
        process.exit(1);
      }
    },
  })
);

if (import.meta.url === `file://${process.argv[1]}`) {
  run(cmd, process.argv);
}