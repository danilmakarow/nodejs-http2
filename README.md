# node http/2 app

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

Headers `service` and `command` required for internal routing, so application's connection could easily be changed to ws.

### DB schema: 
App's mongoDB configuration requires next collections to work properly:
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
- departmentID
```
```
departments: 
- _id
- name
```
