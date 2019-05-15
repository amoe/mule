import PouchDB from 'pouchdb';

export class DataService {
    constructor() {
    }

    // should return response
    update(documentName: string, documentContent: object): Promise<PouchDB.Core.Response> {
        return Promise.reject('foo');
    }
}
