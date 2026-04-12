# ECMWF ERA5 Reanalysis Dataset — Climate Baseline

## Overview

**ERA5** is the 5th generation global atmospheric reanalysis dataset produced by the **European Centre for Medium-Range Weather Forecasts (ECMWF)**. It provides a comprehensive, consistent record of the Earth's atmosphere, land surface, and ocean waves from **1940 to present**.

ERA5 is widely regarded as the authoritative climate baseline for research, industry, and environmental monitoring worldwide.

## Technical Specifications

| Parameter | Value |
|-----------|-------|
| **Spatial resolution** | 0.25° × 0.25° (~25 km at the equator) |
| **Temporal resolution** | Hourly |
| **Temporal coverage** | 1940–present (updated with ~5-day latency) |
| **Vertical levels** | 137 pressure levels (surface to 80 km) |
| **Data assimilation** | 4D-Var, ingesting ~500M observations/day from satellites, radiosondes, aircraft, buoys |
| **Produced by** | ECMWF Copernicus Climate Change Service (C3S) |

## Variables Available

- **Temperature**: 2m air temperature (max, min, mean), soil temperature at multiple depths
- **Precipitation**: Total precipitation, snowfall, convective/large-scale breakdown
- **Wind**: 10m wind speed and direction, wind gusts
- **Humidity**: 2m relative humidity, specific humidity, dewpoint temperature
- **Soil moisture**: Volumetric soil water at 4 depth layers (0–7cm, 7–28cm, 28–100cm, 100–289cm)
- **Evapotranspiration**: FAO Penman-Monteith reference ET₀
- **Radiation**: Surface solar radiation (downward/net), thermal radiation
- **Pressure**: Mean sea level pressure, surface pressure

## Use in AI Weather Models

ERA5 serves as the primary training dataset for the leading AI weather prediction models:

- **GraphCast** (Google DeepMind) — trained on 39 years of ERA5 data, outperforms HRES on 90% of verification targets
- **FourCastNet** (Nvidia) — uses ERA5 for training Fourier Neural Operator-based global forecasts
- **Pangu-Weather** (Huawei) — trained on ERA5 for 3D atmospheric state prediction
- **GenCast** (Google DeepMind) — diffusion-based ensemble model trained on ERA5

## Access via Open-Meteo

ERA5 data is freely accessible through the **Open-Meteo Archive API** at no cost:

- Endpoint: `https://archive-api.open-meteo.com/v1/archive`
- No API key required for reasonable usage
- Daily aggregations available directly (min, max, sum, mean)
- Coordinates-based queries (latitude/longitude)

This is the access method used by Vero for historical environmental context.

## Vero Platform Usage

Vero uses ERA5 data via Open-Meteo to:

1. **Establish climate baselines** for the Caldeira site (-21.83°S, -46.56°W)
2. **Contextualize telemetry readings** against multi-year trends (e.g., "Is this month's precipitation anomalous?")
3. **Support spring health predictions** by correlating historical precipitation with spring flow patterns
4. **Power the AI analyst** with data-backed answers about climate patterns, seasonal trends, and environmental risk

Data provenance is tagged as `source: "open-meteo-archive"` with `provenance: "verified_real"` (ERA5 is observationally constrained reanalysis, not model forecast).

## Citation

Hersbach, H., et al. (2020). The ERA5 global reanalysis. *Quarterly Journal of the Royal Meteorological Society*, 146(730), 1999–2049. https://doi.org/10.1002/qj.3803
