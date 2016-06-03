# testing-cloud-app

Testing cloud application covering various parts of MBaaS APIs.
The basic usage is to deploy this application and access `/test` endpoint,
which will execute all tests and return results (in HTML or JSON format).
Tests can be executed individually per each area or the MBaaS APIs can be
utilized directly via prepared endpoints.


#### Tests endpoints

- `GET /test` execute all tests
- `GET /cache/test` execute Cache API tests
- `GET /db/test` execute Database API tests
- `GET /hash/test` execute Hash API tests
- `GET /host/test` execute Host API test
- `GET /secure/test` execute Secure API tests
- `GET /stats/test` execute Statistics API tests
- `GET /service` execute Service connection test (Cloud App must have permissions to call the Service)


#### Cache API endpoints

- `GET /cache/save`
- `GET /cache/load`
- `GET /cache/remove`

#### Database API endpoints

- `GET /db/create`
- `GET /db/update`
- `GET /db/read`
- `GET /db/list`
- `GET /db/delete`
- `GET /db/deleteall`

#### Hash API endpoints

- `GET /hash/md5`
- `GET /hash/sha1`
- `GET /hash/sha256`
- `GET /hash/sha512`

#### Host API endpoints

- `GET /host`

#### Secure API endpoints

- `GET /secure/rsa_keys`
- `GET /secure/aes_keys`

#### Statistics API endpoints

- `GET /stats/inc`
- `GET /stats/dec`
- `GET /stats/timing`
