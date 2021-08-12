# UI Administration for Sensefinity devices, groups, thresholds configuration.

## Dev env start and redo

In the project directory, you can run:

```
cd client
rm -r node_modules
npm install
```

Go back do project root

```
cd ..
```

Put down container and volume if it's been used before 
(thi is essential when npm packs have been updated)

```
docker-compose down -v
```

Now start docker-compose usual way
