# DataWiz

A clustering visualisation project for real time stream data. The goal is to evaluate the most suitable clustering algorithm based on the available data. Not only different algorithms exist, but also each algorithm takes multiple parameters that might make the difference between a effective/clean and hard-to-interpret algorithm.

Data stream is sent as an (multidimensional) array and it is clustered on the fly. The clusters are saved into cache. The clustering results can be seen in the browser under `localhost:4545`.

## Setup

Download the source code and in the main project folder, run: `docker-compose up`

## Architecture

* Clustering Server: Flask
* Cache: Redis
* Frontend: React