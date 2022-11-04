cd ../workstation
./deploy -so
cd ../debugger 
docker compose up -d
cd ../api-data
docker compose up -d
cd ../api-public
docker compose up -d
cd ../data-persistence
docker compose up -d
cd ../connector-elk
docker compose up -d
cd ../ui-admin
docker build -f server/Dockerfile server -t ui-admin-server-dev
docker build -f client/Dockerfile client -t ui-admin-client-dev
docker compose up $1