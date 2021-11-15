library(tidyverse)
library(glue)
library(sf)
library(rgeoboundaries)
library(lwgeom)
library(jsonlite)
library(leaflet)
library(leaflet.extras2)
library(htmlwidgets)
library(htmltools)
library(here)

# calculate country centroids (roughly - no spherical geometry b/c it's broken)
# NOTE - rgeoboundaries will cache its downloads
sf::sf_use_s2(FALSE)
country_list <-
  geoboundaries() %>%
  st_centroid(of_largest_polygon = TRUE) %>%
  select(country = shapeName, iso = shapeISO, geometry)

# TODO - recode some country names
manual_countries = tribble(
  ~ iso, ~ country,
  "AAA", "testtesttest"
)

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
    capacity_mw = parse_number(capacity_mw))

# renewables vs non-renewables: summarise, join with geometry, reorder, export
totals <-
  irena %>%
  mutate(renewable = recode(renewable_status,
    "Total Renewable" = "renewable",
    "Total Non-Renewable" = "nonrenewable")) %>%
  select(-renewable_status) %>%
  group_by(iso, country, region, year, renewable) %>%
  summarise(
    totalgen_gwh = sum(generated_gwh, na.rm = TRUE),
    totalcap_mw = sum(capacity_mw, na.rm = TRUE)) %>%
  ungroup()

# now output as geojson points
# (sf doesn't support nested geojson output, so we'll have to do it super wide)
totals_wide <-
  totals %>%
  pivot_wider(
    names_from = c(renewable, year),
    values_from = c(totalgen_gwh, totalcap_mw),
    names_sep = ".") %>%
  left_join(country_list, by = "iso")

# export final irena totals data for map
totals_wide %>%
  select(region, iso, irena_name = country.x, rgeo_name = country.y, iso) %>%
  write_csv(here("country-list.csv")) %>%
  # (... and also conflicted country names)
  filter(irena_name != rgeo_name) %>%
  distinct(irena_name, .keep_all = TRUE) %>%
  write_csv(here("country-conflicts.csv"))

# summarise the figures (for setting scales in mapbox)
totals %>% filter(renewable == "renewable") %>% summary()
totals %>% filter(renewable == "nonrenewable") %>% summary()
