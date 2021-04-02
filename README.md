# MULE

Mechanism for Usefully Linking Entities.

## Deployment

This tool is currently expected to be deployed behind SSL and HTTP Basic auth.

The file `src/database-configuration.ts` contains the details for accessing
CouchDB.

To configure the password, create a file `.env.production.local` as such:

    VUE_APP_DATABASE_USERNAME=mule
    VUE_APP_DATABASE_PASSWORD=something
    VUE_APP_DATABASE_URL=http://visarend.solasistim.net:5984/mule

Then you can use `npm run build` in order to build the bundle, which can just be
deployed under Apache or whatever http server you want.
