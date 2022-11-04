# analysis of irena data
# james goldie, 360info, nov 2021

library(tidyverse)
library(glue)
library(sf)
library(rgeoboundaries)
library(countrycode)
library(lwgeom)
library(jsonlite)
library(here)

name_subs <- c(
  "BIH" = "Bosnia and Herzegovina",
  "BOL" = "Bolivia",
  "BRN" = "Brunei",
  "CAF" = "Central African Republic",
  "CHN" = "China",
  "COD" = "Democratic Republic of the Congo",
  "FLK" = "Falkland Islands",
  "FSM" = "Micronesia",
  "GBR" = "United Kingdom",
  "IRN" = "Iran",
  "KOR" = "South Korea",
  "LAO" = "Laos",
  "MAF" = "Saint Martin",
  "MKD" = "North Macedonia",
  "MMR" = "Myanmar",
  "NPL" = "Nepal",
  "PHL" = "Philippines",
  "PRK" = "North Korea",
  "PSE" = "Palestine",
  # ? SGS   South Georgia and the South Sandwich Islands
  # ? SPM   Saint Pierre and Miquelon
  # ? STP   Sao Tome and Principe
  # ? TCA   Turks and Caicos Islands
  "TWN" = "Taiwan",
  "TZA" = "Tanzania",
  "VCT" = "Saint Vincent and Grenadines",
  "VEN" = "Venezuela",
  "XKX" = "Kosovo")
standardise_countries <- partial(countrycode, origin = "iso3c",
    destination = "country.name.en", custom_match = name_subs)

# calculate country centroids (roughly - no spherical geometry b/c it's broken)
# NOTE - rgeoboundaries will cache its downloads
sf::sf_use_s2(FALSE)
country_list <-
  geoboundaries() %>%
  st_centroid(of_largest_polygon = TRUE) %>%
  select(country = shapeName, iso = shapeISO, geometry)

# TODO - recode some country names
# manual_countries <- tribble(
#   ~ iso, ~ country,
#   "AAA", "testtesttest"
# )

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

# widen by renewable status to calculate proportion of renewables
proportions <-
  totals %>%
  pivot_wider(
    names_from = renewable,
    values_from = c("totalgen_gwh", "totalcap_mw")) %>%
  replace_na(list(
    totalgen_gwh_renewable = 0,
    totalcap_mw_renewable = 0,
    totalgen_gwh_nonrenewable = 0,
    totalcap_mw_nonrenewable = 0)) %>%
  mutate(
    allgen_gwh = totalgen_gwh_renewable + totalgen_gwh_nonrenewable,
    allcap_mw = totalcap_mw_renewable + totalcap_mw_nonrenewable,
    propgen_gwh_renewable = totalgen_gwh_renewable / allgen_gwh,
    propcap_mw_renewable = totalcap_mw_renewable / allcap_mw) %>%
  select(iso, country, region, year, starts_with("all"), starts_with("prop"))

# now output as geojson points
# (sf doesn't support nested geojson output, so we'll have to do it super wide)
totals_wide <-
  proportions %>%
  pivot_wider(
    names_from = year,
    values_from = c(allgen_gwh, allcap_mw, propgen_gwh_renewable,
      propcap_mw_renewable),
    names_sep = ".") %>%
  left_join(country_list, by = "iso") %>%
  select(-starts_with("country")) %>%
  mutate(country = standardise_countries(iso)) %>%
  select(iso, country, region, everything()) %>%
  st_write(here("src", "data", "irena-totals.geojson"))

# country lists
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
