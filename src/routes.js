const Apify = require('apify');

const {
    utils: { log },
} = Apify;

exports.handleStart = async ({ $, request, crawler: { requestQueue } }) => {
    const authors = $('tr[onclick*="window.document.location"] td a')
        .map((i, el) => $(el).attr('href'))
        .get();

    const totalPage = $('ul.pagination')
        .eq(0)
        .find('li.page-item:nth-last-child(2)')
        .text();

    const paginationUrl = request.loadedUrl;
    for (let i = 2; i <= totalPage; i++) {
        await requestQueue.addRequest({
            url: `${paginationUrl}${i}`,
            userData: {
                label: 'DEFAULT',
            },
        });
    }
    authors.forEach(async (url) => {
        await requestQueue.addRequest({
            url: `https://www.brainyquote.com${url}`,
            userData: {
                label: 'DETAILS',
            },
        });
    });
};

exports.handleList = async ({ request, $ }) => {
    // taking the lists of qoutes.
    // scrape the list only (might need to load details as per the need.)
    // source html => name req_id
    // detail_url, quote, author, req_id , id, html_chunk

    const quoteBlock = $('div[id*=pos_]');

    for (let i = 0; i < quoteBlock.length; i++) {
        
    }
};

exports.handleDetail = async ({ request, $ }) => {
    // Handle details
};
