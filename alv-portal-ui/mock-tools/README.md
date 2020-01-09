The configuration files for the json-server. Allows you to mock the backend

##Usage
```bash
json-server --watch db.json --routes routes.json --middlewares middleware-search-post.js 
```

then add to your proxy.conf something like this if you want to mock work-requirements: 

```
  "/competencecatalogservice-editor/api/work-requirements/": {
    "target": "http://localhost:3000/",
    "secure": false,
    "loglevel": "debug"
  },
```
