# `/data`

## `irena-totals.csv` and `irena-totals.geojson`

Tidied IRENA data on the amount of electricity capacity or generation by country and year. The CSV is lengthened, with a row for each country and year combination; the geoJSON is wider, with one feature per country and each year included as a separate field.

Fields or columns include:

`iso`: A country's [ISO 3166-1 alpha-3 code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3)
`country`: A country's name
`lon`: Longitude of the country's centroid (using the largest polygon in most, but not all, cases)
`lat`: Latitude of the country's centroid (using the largest polygon in most, but not all, cases)
`year`: Year of observation
`total_gen_gwh`: Total electricity generation across all sources, in gigawatt-hours
`renewprop_gen_gwh`: fraction of electricity generation that was from renewable sources (0 to 1)
`total_cap_mw`: Total installed electricity capacity across all sources, in gigawatt-hours
`renewprop_cap_mw`: fraction of installed electricity capacity that was from renewable sources (0 to 1)

## `irena-src-*.csv`

These are tables downloaded from [IRENASTAT](https://pxweb.irena.org/pxweb/en/IRENASTAT):

* Installed electricity capacity by country/area (MW) by Country/area, Technology, Grid connection and Year
* Electricity generation (GWh) by Country/area, Technology, Grid connection and Year

They have been split up by grid status (on-grid and off-grid) in order to keep under IRENASTAT's 100k record extraction limit. They are processed by [`index.qmd`](/index.qmd).
