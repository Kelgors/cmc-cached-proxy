# CoinMarketCap Quote Proxy

Proxy for cryptocurrencies prices [Public API](https://kelgors-cmc-proxy.herokuapp.com/)
The purpose is to give cryptocurrencies prices easily (without the necessity to have exact prices). My first usage was to use it for my Excel sheet to automatically update price table but i can be used for any application.<br />
You can add coin from the task initialize_quotes or by adding them from the admin api.

## Scripts

`npm start` start the api server.

`node tasks/initialize_quotes.js` import the 200 first coins from CoinMarketCap

`node tasks/update_quote.js` should be executed some times (every 30 min) to update price table. Use api credits.

## Public route

`GET /quotes/latest.(json|csv)`

```json
[
    {
        "id": 1,
        "name": "Bitcoin",
        "symbol": "BTC",
        "slug": "bitcoin",
        "circulating_supply": 18631093,
        "total_supply": 18631093,
        "max_supply": 21000000,
        "num_market_pairs": 9682,
        "cmc_rank": 1,
        "price": 51018.79232001736,
        "volume_24h": 84821692828.66429,
        "percent_change_1h": -0.61137449,
        "percent_change_24h": 4.29527694,
        "percent_change_7d": 9.66836696,
        "percent_change_30d": 40.12399204,
        "market_cap": 950535864461.9292,
        "last_updated": "2021-02-17T12:59:02.000Z",
        "icon": "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"
    },
    {
        "id": 1027,
        "name": "Ethereum",
        "symbol": "ETH",
        "slug": "ethereum",
        "circulating_supply": 114707815.0615,
        "total_supply": 114707815.0615,
        "max_supply": 0,
        "num_market_pairs": 5909,
        "cmc_rank": 2,
        "price": 1823.9566452205543,
        "volume_24h": 38726744348.1103,
        "percent_change_1h": 0.88112932,
        "percent_change_24h": 2.21742051,
        "percent_change_7d": 1.93499743,
        "percent_change_30d": 48.75633576,
        "market_cap": 209222081540.1533,
        "last_updated": "2021-02-17T12:59:02.000Z",
        "icon": "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"
    }
]
```

# Admin routes

`GET /admin/quotes` list all cryptocurrencies
`POST /admin/quotes` Create a new cryptocurrency
`GET /admin/quotes/:id` show a cryptocurrency by id
`DELETE /admin/quotes/:id` Delete one cryptocurrencies by id

`GET /admin/quotes/cmc?symbol=BTC` Display available cryptocurrencies with the given symbol directly from CoinMarketCap (use api credits)
