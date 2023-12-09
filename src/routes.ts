import { createCheerioRouter, KeyValueStore } from 'crawlee';

export const router = createCheerioRouter();

const store = await KeyValueStore.open('genshin');

router.addDefaultHandler( async ctx => {
  const { request, $, log, pushData } = ctx;
  const title = $('title').text();
  log.info(`${title}`, { url: request.loadedUrl });

  const list = $('.resp-tabs-container .home-box-tag .iteminfo .home-box-tag-1 a[title]');
  const urls = new Set<string>();
  for (const item of list) {
    const { title, href } = item.attribs;
    if (!title.startsWith('旅行者')) {
      urls.add(href);
    }
  }

  log.info(`Total: ${urls.size}`);

  ctx.enqueueLinks({
    urls: [...urls],
    label: 'detail',
  });
});

router.addHandler('detail', async ({ request, $, log, pushData }) => {
  const title = $('title').text();
  log.info(`${title}`, { url: request.loadedUrl });

  const name = title.substring(0, title.indexOf('语音'));

  const result = {
    name,
    voices: [],
  };

  const list = $('.resp-tabs-container .wikitable');
  for (const item of list) {
    const data = {
      topic: $(item).find('th').first().text().trim(),
      chs: $(item).find('.voice_text_chs_m').text().trim(),
      jp: $(item).find('.voice_text_jp_m').text().trim(),
      en: $(item).find('.voice_text_en_m').text().trim(),
      kr: $(item).find('.voice_text_kr_m').text().trim(),
    };
    result.voices.push(data);
    // log.info('%j', data);
  }

  pushData(result);
});
