library(tidyverse)
library(CoordinateCleaner)
library(glue)
library(sf)
library(jsonlite)
library(leaflet)
library(leaflet.extras2)
library(htmlwidgets)
library(htmltools)
library(here)

# get country centroids
# NOTE - countryref uses the 2014 cia world factbook. it could be out of date!
# NOTE - there're a lot of duplicates here! review
data(countryref)
country_list <-
  countryref %>%
  as_tibble() %>%
  filter(source == "geolocate") %>%
  distinct(iso3, .keep_all = TRUE) %>%
  select(iso3, name, centroid.lon, centroid.lat)

# import the data
# (readr isn't handling the combo of quoting _and_ group separating the figures,
# so i process them manually)
irena <-
  read_csv(
    here("data", "irena-stats.csv"),
    col_names = c("region", "country", "iso", "renewable_status",
      "tech_group", "technology", "grid_status", "year", "generated_gwh",
      "capacity_mw"),
    col_types = "cccccccdcc",
    skip = 1) %>%
  mutate(
    generated_gwh = parse_number(generated_gwh),
    capacity_mw = parse_number(capacity_mw)) %>%
  # add the centroids on
  left_join(country_list, by = c("iso" = "iso3"))

write_csv(irena, here("src", "data", "irena.csv"))
write_json(irena, here("src", "data", "irena.json"))

# test case: total renewable figures in 2019
renewables_2019 <-
  irena %>%
  filter(renewable_status == "Total Renewable", year == 2019) %>%
  group_by(iso, country, region) %>%
  summarise(
    centroid.lat = centroid.lat[1],
    centroid.lon = centroid.lon[1],
    generated_gwh = sum(generated_gwh, na.rm = TRUE),
    capacity_mw = sum(capacity_mw, na.rm = TRUE)) %>%
  ungroup()

# TODO - for timeslider, add sf location col, add Date column from year

# visualise test case!
popup_label <- partial(scales::number,
  big.mark = ", ", suffix = " MW", accuracy = 1)

renew_map <-
  leaflet(renewables_2019, options = leafletOptions(
    minZoom = 2)) %>%
  addTiles() %>%
  # addTimeslider() %>%
  addCircles(
    lng = ~ centroid.lon,
    lat = ~ centroid.lat,
    radius = ~ sqrt(capacity_mw) * 2000,
    fillColor = "orange",
    fillOpacity = 0.8,
    color = "transparent",
    popup = ~ glue(
      "<h2>{country}</h2>",
      "<p>Capacity: {popup_label(capacity_mw)}</p>"))

# add css/js dependencies
# htmlDependencies(renew_map) <- list(
#   htmlDependency()
# )

# export map
renew_map %>%
  saveWidget(here("test", "test.html"), 
  title = "Fancy title here",
  selfcontained = FALSE, libdir = "js")