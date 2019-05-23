import PouchDB from 'pouchdb';
import { DATABASE, USERNAME, PASSWORD } from '@/database-configuration';
import { Document } from '@/types';
import { cloneDeep, uniq } from 'lodash';

type PDBCR = PouchDB.Core.Response;

const ID_PROPERTY = '_id';
const REV_PROPERTY = '_rev';

function getId(documentName: string): string {
    if (documentName.includes(':')) {
        throw new Error("bad documentname");
    }

    const timestamp: string = new Date().toISOString();
    return documentName + ":" + timestamp;
}

function getDocumentNameFromId(id: string): string {
    return id.replace(/:.*/, "");
}


export class DataService {
    db: PouchDB.Database<Document>;

    constructor() {
        console.log("connecting to server %o", DATABASE);
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

    getDocumentNames(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            return this.db.allDocs().then(response => {
                const result = uniq(
                    response.rows.map(row => getDocumentNameFromId(row.id))
                );
                resolve(result);
            });
        });
    }

    // should return response
    update(documentName: string, documentContent: Document): Promise<PDBCR> {
        const augmentedDocument: any = cloneDeep(documentContent);
        augmentedDocument[ID_PROPERTY] = getId(documentName);

        return this.db.put(augmentedDocument).catch(error => {
            if (error.name === 'conflict') {
                console.log("conflict, attempting update");
                return this.db.get(documentName).then(response => {
                    return this.db.put(
                        Object.assign(
                            {},
                            augmentedDocument,
                            { [REV_PROPERTY]: response._rev }
                        )
                    );
                });
            } else {
                return Promise.reject(error);
            }
        });
    }

    listAllDocuments(): void {
        this.db.allDocs().then(response => {
            response.rows.forEach(x => {
                console.log("row: %o", x);
            });
        });
    }

    getLatestVersion(documentName: string): Promise<Document> {
        return new Promise((resolve, reject) => {
            return this.db.allDocs().then(response => {
                const filteredRows = response.rows.filter(
                    row => row.id.startsWith(documentName + ":")
                );

                if (filteredRows.length === 0) {
                    throw new Error("no such document");
                }

                const lastRow = filteredRows[filteredRows.length - 1];

                return this.db.get(lastRow.id).then(response => {
                    resolve(response);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }
}
