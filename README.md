# MULE

Mechanism for Usefully Linking Entities.

## Deployment

This tool is currently expected to be deployed behind SSL and HTTP Basic auth.

The file `src/database-configuration.ts` contains the details for accessing
CouchDB.

To configure the password, create a file `.env.local` as such:

    VUE_APP_DATABASE_PASSWORD=xyzzy
