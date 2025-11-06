# E‑Com Sample (Node.js + Express)


Simple demo app to show CI/CD with Jenkins and Docker.


## Run locally


1. Install Node 18+ and npm
2. `npm install`
3. `npm start`
4. Open http://localhost:3000


## Run with Docker


```bash
docker build -t deepak37/ecom-sample:local .
docker run -p 3000:3000 deepak37/ecom-sample:local
