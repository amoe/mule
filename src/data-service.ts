import PouchDB from 'pouchdb';
import { DATABASE, USERNAME, PASSWORD } from '@/database-configuration';
import { Document } from '@/types';

type PDBCR = PouchDB.Core.Response;

const ID_PROPERTY = '_id';
const REV_PROPERTY = '_rev';

export class DataService {
    db: PouchDB.Database<Document>;

    constructor() {
        this.db = new PouchDB<Document>(
            DATABASE,
            {
                'auth': {
                    'username': USERNAME,
                    'password': PASSWORD
                }
            }
        );
    }

    // should return response
    update(documentName: string, documentContent: Document): Promise<PDBCR> {
        // XXX: FIxup the content first


        return this.db.put(documentContent).catch(error => {
            if (error.name === 'conflict') {
                console.log("conflict, attempting update");
                return this.db.get(documentName).then(response => {
                    return this.db.put(
                        Object.assign(
                            {},
                            documentContent,
                            { [REV_PROPERTY]: response._rev }
                        )
                    );
                });
            } else {
                return Promise.reject(error);
            }
        });
    }
}
