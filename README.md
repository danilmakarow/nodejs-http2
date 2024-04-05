# node http/2 app

node version: `20.7.0`, npm version: `10.1.0`

For API testing purposes simple frontend application was created. It placed in the "front-end" directory and can be initialized by opening the "index.html" file in browser.

## Starting the App

```bash
npm start
```
For development (assuming you have globally installed nodemon)
```bash
npm run start:dev
```

### Opened http/2 endpoints: 

```
GET /employers
service: LOAD_EMPLOYERS
```

```
POST /employers
service: POST_LOAD_EMPLOYERS_OPTIONS
command: NOTIFY
```

To

Headers `service` and `command` required for the internal routing, so application's connection could be easily changed to the ws.

### DB schema: 
App was configured to connect to the hosted DB cluster. MongoDB schema:
```
DB name: company
```

```
employers: 
- _id
- name
- age
- positionId
```
```
positions: 
- _id
- name
- departmentId
```
```
departments: 
- _id
- name
```
