const Apify = require('apify');
const { handleStart, handleList, handleDetail } = require('./src/routes');

const {
    utils: { log },
} = Apify;

Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue(new Date().toISOString());
    const proxyConfiguration = await Apify.createProxyConfiguration({
        // password: 'apify_proxy_dHMh8gWtkuIo5iOQEGy9P4sPxhsCIA2DiluV',
        // fetching proxy urls manually for time being !!
        proxyUrls: [],
    });

    // await requestQueue.addRequest({
    //     url: `https://www.brainyquote.com/authors/a-boogie-wit-da-hoodie-quotes`,
    //     userData: {
    //         label: 'LIST',
    //     },
    // });

    let alphaBets = 'a b c d e f g h i j k l m n o p q r s t u v w x y z';
    alphaBets = alphaBets.split(' ');
    for (let i = 0; i < alphaBets.length; i++) {
        await requestQueue.addRequest({
            url: `https://www.brainyquote.com/authors/${alphaBets[i]}`,
            userData: {
                label: 'DEFAULT',
            },
        });
    }

    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        proxyConfiguration,
        minConcurrency: 10,
        maxConcurrency: 20,
        handlePageFunction: async (context) => {
            const {
                url,
                userData: { label },
            } = context.request;
            log.info('Page opened.', { label, url });
            switch (label) {
                case 'LIST':
                    return handleList(context, requestQueue);
                case 'DETAIL':
                    return handleDetail(context, requestQueue);
                default:
                    return handleStart(context, requestQueue);
            }
        },
    });

    log.info('Starting the crawl.');
    await crawler.run();
    log.info('Crawl finished.');
});
