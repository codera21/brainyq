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
        proxyUrls: [
            'http://amit1:2sZvnay7H8j@23.106.164.80:11862',
            'http://amit1:2sZvnay7H8j@23.106.163.154:11862',
            'http://amit1:2sZvnay7H8j@142.234.139.203:11862',
            'http://amit1:2sZvnay7H8j@45.59.28.18:11862',
            'http://amit1:2sZvnay7H8j@23.19.224.118:11862',
            'http://amit1:2sZvnay7H8j@108.62.72.230:11862',
            'http://amit1:2sZvnay7H8j@108.62.54.249:11862',
            'http://amit1:2sZvnay7H8j@216.107.139.16:11862',
            'http://amit1:2sZvnay7H8j@172.241.145.203:11862',
            'http://amit1:2sZvnay7H8j@173.208.231.87:11862',
            'http://amit1:2sZvnay7H8j@45.59.21.104:11862',
            'http://amit1:2sZvnay7H8j@45.59.25.139:11862',
            'http://amit1:2sZvnay7H8j@216.107.141.61:11862',
            'http://amit1:2sZvnay7H8j@23.19.115.46:11862',
            'http://amit1:2sZvnay7H8j@23.19.36.209:11862',
            'http://amit1:2sZvnay7H8j@45.59.16.59:11862',
            'http://amit1:2sZvnay7H8j@45.59.31.178:11862',
            'http://amit1:2sZvnay7H8j@172.241.135.80:11862',
            'http://amit1:2sZvnay7H8j@108.62.193.65:11862',
            'http://amit1:2sZvnay7H8j@172.93.239.114:11862',
            'http://amit1:2sZvnay7H8j@168.81.218.143:11862',
            'http://amit1:2sZvnay7H8j@45.59.25.177:11862',
            'http://amit1:2sZvnay7H8j@23.81.131.138:11862',
            'http://amit1:2sZvnay7H8j@108.62.137.59:11862',
            'http://amit1:2sZvnay7H8j@23.106.162.137:11862',
            'http://amit1:2sZvnay7H8j@196.19.198.138:11862',
            'http://amit1:2sZvnay7H8j@23.19.37.250:11862',
            'http://amit1:2sZvnay7H8j@23.81.132.125:11862',
            'http://amit1:2sZvnay7H8j@173.208.9.164:11862',
            'http://amit1:2sZvnay7H8j@23.81.130.169:11862',
            'http://amit1:2sZvnay7H8j@108.62.95.128:11862',
            'http://amit1:2sZvnay7H8j@108.62.94.212:11862',
            'http://amit1:2sZvnay7H8j@196.19.199.124:11862',
            'http://amit1:2sZvnay7H8j@23.81.129.237:11862',
            'http://amit1:2sZvnay7H8j@172.241.134.206:11862',
            'http://amit1:2sZvnay7H8j@216.107.140.14:11862',
            'http://amit1:2sZvnay7H8j@142.91.255.242:11862',
            'http://amit1:2sZvnay7H8j@216.107.137.94:11862',
            'http://amit1:2sZvnay7H8j@168.81.216.117:11862',
            'http://amit1:2sZvnay7H8j@23.81.128.138:11862',
            'http://amit1:2sZvnay7H8j@45.59.19.238:11862',
            'http://amit1:2sZvnay7H8j@108.62.246.80:11862',
            'http://amit1:2sZvnay7H8j@108.62.241.218:11862',
            'http://amit1:2sZvnay7H8j@172.241.133.66:11862',
            'http://amit1:2sZvnay7H8j@104.237.211.95:11862',
            'http://amit1:2sZvnay7H8j@172.241.132.53:11862',
            'http://amit1:2sZvnay7H8j@108.62.204.16:11862',
            'http://amit1:2sZvnay7H8j@64.120.85.199:11862',
        ],
    });

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
        maxConcurrency: 20,
        handlePageFunction: async (context) => {
            const {
                url,
                userData: { label },
            } = context.request;
            log.info('Page opened.', { label, url });
            switch (label) {
                
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
