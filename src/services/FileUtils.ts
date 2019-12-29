import { fetchProfile } from './fetchProfile';
import { space } from 'rdf-namespaces';
import { fetchPublicTypeIndex } from './fetchPublicTypeIndex';
const FileClient = require('solid-file-client');

export interface IFolder {
    type: "folder";
    name: string; // folder name (without path),
    url: string; // full URL of the resource,
    modified: string; // dcterms:modified date
    mtime: string; // stat:mtime
    size: number;// stat:size
    parent: string;// parentFolder or undef if none,
    content: string; // raw content of the folder's turtle representation,
    files: Array<any>; // an array of files in the folder
    folders: IFolder[];// an array of sub-folders in the folder,
    known?: boolean;//details of sub folders are read (in treeview)
}

export default class FileUtils {

    static async getRoot() {
        const [profile, publicTypeIndex] = await Promise.all([fetchProfile(), fetchPublicTypeIndex()]);
        if (profile === null || publicTypeIndex === null) {
            return null;
        }

        let root = profile.getRef(space.storage);
        if (typeof root !== 'string') {
            return null;
        }
        
        if (root && root !== undefined) {
            root = root.substring(root.length - 1, root.length) === "/" ? root.slice(0, -1) : root
        }

        return root
    }
    
    static async checkNotesFolder () {
        const notesFolderRef = await this.getRoot() + 'public/shoutbox';
        FileClient.readFolder(notesFolderRef)
        .then (
            null ,
            FileClient.createFolder(notesFolderRef) 
        )
      }
      
    //Interface method for FileClient.readFile
    static async readFileAsString(url: string) {
        url = url.startsWith('http') ? url : 'https://' + url
        let res: string = ''
        await FileClient.readFile(url).then(
            (body: string) => {res = body }
            , (err: any) => {
                console.log(`Error when reading file ${url}, returning blank`)
            });
        return res as string
    }

}