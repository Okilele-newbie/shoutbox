import { Meta} from './MetaUtils';

interface CouchDbRowKeyValue {
  key: string,
  value: string
}

export interface FoundTags {
  key: string,
  value: string
}

export default class CouchDb {

  static couchDbServerUrl = `http://91.186.9.6:5984`
  static couchDbDatabaseName = `solid`
  //static couchDbServerUrl = `http://127.0.0.1:5984`
  //static couchDbDatabaseName = `solidfilemanager`
  static couchDbBaseUrl = `${CouchDb.couchDbServerUrl}/${CouchDb.couchDbDatabaseName}`

  static async getShoutBoxMetas(): Promise<Array<any>> {
       const url = `${this.couchDbBaseUrl}/_design/DesignDoc/_view/MetasByTagsAndDates?startkey="appName:shoutbox"&endkey="appName:shoutboxZ"&descending=false&limit=25`
       console.log(url)
       return await this.executeQueryonCouch(url)
   }

  static executeQueryonCouch(url: string): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      const xhr = this.CreateRequest('GET', url);
      if (xhr) {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            let res = JSON.parse(xhr.response)
            resolve(res.rows)
          } else {
            console.log(xhr.statusText)
            reject(xhr.statusText);
          }
        };
        xhr.onerror = () => {
          console.log(xhr.statusText)
          reject(xhr.statusText);
        }
        xhr.send();
      }
    })
  }

  static writeMeta(meta: Meta) {
    const xhr = this.CreateRequest('PUT', `${this.couchDbBaseUrl}/${this.createIdFromMeta(meta)}`);
    if (xhr) {
      // Response handlers.
      xhr.onload = function () { };
      xhr.onerror = function () {
        alert('Error writing meta in CouchDb.');
      };
      xhr.send(JSON.stringify(meta));
    }
  }

  // Create the XHR object.
  static CreateRequest(method: string, url: string) {
    let xhr = new XMLHttpRequest();

    if ("withCredentials" in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, true); //false to be sync
      xhr.setRequestHeader("Content-Type", "application/json");
    } else {
      alert('XMLHttpRequest not supported');
    }
    return xhr;
  }

  //Create an id replacing '/' of the URI by dots
  static createIdFromMeta(meta: Meta) {
    const reg = new RegExp("[/]", "g")
    return (meta.hostName + meta.pathName).replace(reg, '.')
  }
}
