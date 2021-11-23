
This map visualises the progression of installed energy capacity and generation over the last 20 years using data from the [International Renewable Energy Agency](https://www.irena.org/Statistics/View-Data-by-Topic/Capacity-and-Generation/Statistics-Time-Series).

# Use + Remix

Please attribute 360info and IRENA when you use and remix this visualisation.

### Prerequisite: Mapnbox access token

However you deploy this map, you'll need an access token from [Mapbox](https://www.mapbox.com). Simply sign up for an account and, from the [account dashboard](https://account.mapbox.com), create a new access token with public scopes selected.

Mapbox offers 50 000 map loads per month for free, but further use by your users beyond that will require a [paid plan](https://www.mapbox.com/pricing/#maploads).

## Deploy with Netlify

The quickest way to get started with this map is with Netlify:

[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jimjam-slam/report-energy-transition)

Netlify will ask you for your Mapbox access token. Once you've deployed the site, you can configure it to use a custom domain or subdomain (if you have one), or simply serve it from the address that Netlify supplied.

Netlify offers 100 GB of bandwidth per month for free; additional use beyond that requires a [paid plan](https://www.netlify.com/pricing).

## Manual deployment

You can also fork this repo and deploy it somewhere else yourself.

To build the site, create a `.env` file in the project root that contains your Mapbox access token:

```
MAPBOX_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Then use:

```shell
npm install
npm run build
```

The site builds from the `src` dubdirectory to `dist`.

## Reproduce the analysis

Our analysis of IRENA data is done in [R](http://r-project.org) and can be found in `analysis.r`. It creates `src/data/irena-totals.geojson`.

# Help

If you find any problems with our analysis or the map, please feel free to [create an issue](https://github.com/jimjam-slam/report-energy-transition/issues/new)!
