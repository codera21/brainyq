const Apify = require('apify');
const fs = require('fs');

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
    log.info(`${authors.length} Authors found`);
    authors.forEach(async (url) => {
        await requestQueue.addRequest({
            url: `https://www.brainyquote.com${url}`,
            userData: {
                label: 'LIST',
            },
        });
    });
};

exports.handleList = async ({ request, $, response }) => {
    // taking the lists of qoutes, not using pagination first coz i think we can get 5k quotes
    // scrape the list only (might need to load details as per the need.)

    // detail_url, quote, author, req_id , id, html_chunk

    const html = `<html>${$('html').html()}</html>`;
    fs.writeFileSync(`./apify_storage/html/${request.id}.html`, html);

    const quoteBlocks = $('div[id*=pos_]');

    for (let i = 0; i < quoteBlocks.length; i++) {
        const quoteBlock = quoteBlocks.eq(i);
        const ret = {
            req_id: request.id,
            url: request.url,
            detail_url: `https://www.brainyquote.com${quoteBlock
                .find('a[title="view quote"]')
                .attr('href')}`,
            qoute: quoteBlock.find('a[title="view quote"] div').text(),
            author: quoteBlock.find('a[title="view author"]').text(),
            html_chunk: quoteBlock.html(),
        };  

        await Apify.pushData(ret);
    }
};

exports.handleDetail = async ({ request, $ }) => {
    // Handle details
};
