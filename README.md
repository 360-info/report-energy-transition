# Renewables transition

Visualises the growth of renewable electricity capacity and generation over the last 20 years using data from the [International Renewable Energy Agency](https://www.irena.org/Statistics/View-Data-by-Topic/Capacity-and-Generation/Statistics-Time-Series).

## Use + Remix rights

![[Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0)](https://mirrors.creativecommons.org/presskit/buttons/80x15/png/by.png)

The map and the analysis that underpins it are available under a Creative Commons Attribution 4.0 licence. This includes commercial reuse and derivates.

The data is made available by the [International Renewable Energy Agency](https://www.irena.org/Statistics/View-Data-by-Topic/Capacity-and-Generation/Statistics-Time-Series), provided they are acknowledged as the source of the data.

**Please attribute 360info and IRENA when you use and remix this visualisation.**

## Reproduce the analysis

### 💨 Quickstart: use the dev container

This project comes with a ready-to-use [dev container](https://code.visualstudio.com/docs/remote/containers) that includes everything you need to reproduce the analysis (or do a similar one of your own!), including [R](https://r-project.org) and [Quarto](https://quarto.org).

If you have a GitHub account, open the project in GitHub Codespaces for free with two clicks:
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/360-info/report-energy-transition?quickstart=1)

If you have Docker installed, you can also build and run the container locally:
  - Download or clone the project
  - Open it in [Visual Studio Code](https://code.visualstudio.com)
  - Run the **Remote-Containers: Reopen in Container** command

Once the container has launched (it might take a few minutes to set up the first time), you can run the analysis scripts with:

```sh
quarto render
```

### Manually running
We typically publish graphics using [Quarto](https://quarto.org) notebooks, which can be found in the`*.qmd` files. Quarto allows reproducible analysis and visualisation to be done in a mix of languages, but we typically use [R](https://r-project,.org) and [Observable JS](https://observablehq.com/@observablehq/observables-not-javascript).

You'll need to:
- [Download and install Quarto](https://quarto.org/docs/get-started)
- [Download the install R](https://www.r-project.org)
- Satisfy the R package dependencies. In R:
  * Install the [`renv`](https://rstudio.github.io/renv) package with `install.packages("renv")`,
  * Then run `renv::restore()` to install the R package dependencies.
  * (For problems satisfying R package dependencies, refer to [Quarto's documentation on virtual environments](https://quarto.org/docs/projects/virtual-environments.html).)

Now, render the `.qmd` files to the `/out` directory with:

```sh
quarto render
```

## Help

If you find any problems with our analysis or the map, please feel free to [create an issue](https://github.com/360-info/report-energy-transition/issues/new)!
