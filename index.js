const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const PORT = 8000;
const app = express();

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
    }
]

const articles = []

newspapers.forEach(newspapers => {
    axios.get(newspapers.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspapers.base + url,
                    source: newspapers.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to me');
})

app.get('/news', (req, res) => {
    res.json(articles);
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAdress = newspapers.filter(newspapers => newspapers.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspapers => newspapers.name == newspaperId)[0].name

    axios.get(newspaperAdress)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html)
            const spesificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                spesificArticles.push({
                    title,
                    url: newspaperBase + url,
                    base: newspaperBase
                })
            })
            res.json(spesificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

// axios.get('https://www.theguardian.com/environment/climate-crisis')
// .then((response) => {
//     const html = response.data;
//     const $ = cheerio.load(html);

//     $('a:contains("climate")', html).each(function () {
//        const title =  $(this).text();
//        const url = $(this).attr("href");
//        articles.push({
//            title,
//            url
//        })
//     })
//     res.json(articles);
// }).catch((err) => {console.log(err)});