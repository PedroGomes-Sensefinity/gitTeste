cd ../workstation
./deploy -so
cd ../api-data
docker compose up -d
cd ../geofences
docker compose up -d
cd ../ui-admin
docker build -f server/Dockerfile server -t ui-admin-server-dev
docker build -f client/Dockerfile client -t ui-admin-client-dev
docker compose up $1
