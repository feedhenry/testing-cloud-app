# Artillery
[Artillery](https://artillery.io/) is a command-line load testing tool that will send requests directly to UPS's REST API.

Install Artillery:
```
npm install -g artillery
```

## Disclaimer
Don't use on production serves.
Don't use without mocked/proxied push providers.

## Run push load tests
First deploy cloud app and get its url.
Update target URL in ups-artillery.yml file OR add it as CLI parameter (--target <STRING>).

Modify *duration* and *arrivalRate* parameters to achieve your desired testing load.

Run:
```
artillery run push-artillery.yml
```

### Customize message
Basic format is:
```
{
    "message": {
        "alert": "Artillery Test"
    },
    "options": {
        "broadcast": "true"
    }
}
```

Under the hood we are using aerogear-unifiedpush-nodejs-client so you can refer to its documentation on possible message parameters:
https://github.com/aerogear/aerogear-unifiedpush-nodejs-client#clientsendersendmessage-options