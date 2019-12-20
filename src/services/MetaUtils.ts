import CouchDb from './CouchDb';
import FileUtils from './FileUtils';
const FileClient = require('solid-file-client');

export interface MetaTag {
    tagType: string,
    value: string,
    published: boolean
}

export interface Meta {
    hostName: string,
    pathName: string,
    mimeType: string,
    creationDate: Date,
    tags: MetaTag[],
    _rev?: string //CouchDb field
}

export default class MetaUtils {
    static tagDir = '/public'
    static tagFileName = '_Meta.json'
    static metaIndexFilePath: string

    static async getMetaIndexFilePath() {
        if (this.metaIndexFilePath === undefined) {
            const root = await FileUtils.getRoot()
            this.metaIndexFilePath = `${root}${MetaUtils.tagDir}/${MetaUtils.tagFileName}`
        }
        return this.metaIndexFilePath
    }

    static async createMeta(notesListRef: string) {
        const url = new URL(notesListRef)
        let meta = {
            hostName: url.hostname,
            pathName: url.pathname,
            mimeType: 'ttl',
            creationDate: new Date(),
            tags: [
                { tagType: 'AppName', value: 'shoutbox', published: true },
            ]
        } as Meta

        //FILE: remove old meta from list if exists and add the new one
        let allLocalMetas: Meta[] = await this.getAllLocalMetas() as unknown as Meta[]
        allLocalMetas = allLocalMetas.filter(el => !(el.hostName === meta.hostName && el.pathName === meta.pathName));
        allLocalMetas.push(meta)
        FileClient.updateFile(
            await this.getMetaIndexFilePath(),
            JSON.stringify(allLocalMetas)
        )

        //COUCHDB:
        CouchDb.writeMeta(meta)
    }

    //Local storage, read the file and get all metas in it
    static async getAllLocalMetas() {
        let allMetas = [] as Meta[]
        var json: string = await FileUtils.readFileAsString(await this.getMetaIndexFilePath())
        if (json !== '') allMetas = JSON.parse(json)
        return allMetas
    }

    static async getCentralMetas(): Promise<Array<any>> {
        return await CouchDb.getShoutBoxMetas()
    }
}
