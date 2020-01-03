import React from 'react';
import { fetchDocument, createDocument, TripleDocument, TripleSubject } from 'tripledoc';
import { schema } from 'rdf-namespaces';
import { usePublicTypeIndex } from './usePublicTypeIndex';
//import { initialiseNotesList } from '../services/initialiseNotesList';
import MetaUtils from '../services/MetaUtils'

export function useNotesList() {
  const publicTypeIndex = usePublicTypeIndex();
  const [notesList, setNotesList] = React.useState<TripleDocument[]>();

  React.useEffect(() => {
    if (!publicTypeIndex) {
      return;
    }

    (async () => {
      const centralMetas = await MetaUtils.getCentralMetas() as any[]
      let notes = [] as TripleDocument[]
      for (let i = 0; i < centralMetas.length; i++) {
        let document
        try {
          document = await fetchDocument('https://' + centralMetas[i].value.hostName + centralMetas[i].value.pathName);
        } catch {
          //document was deleted but not the index
          document = createDocument('')
        }
        notes.push(document)
      }
      setNotesList(notes);
    })();

  }, [publicTypeIndex]);

  return notesList;
}

export function getNotes(notesList: TripleDocument[]): TripleSubject[] {
  let subjectsList = [] as TripleSubject[]
  notesList.forEach((note: TripleDocument) => {
    subjectsList.push(note.getSubjectsOfType(schema.TextDigitalDocument)[0])
  })
  return subjectsList
}


