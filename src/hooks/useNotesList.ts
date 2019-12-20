import React from 'react';
import { fetchDocument, TripleDocument, TripleSubject } from 'tripledoc';
import { solid, schema } from 'rdf-namespaces';
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
        const document = await fetchDocument('https://' + centralMetas[i].value.hostName + centralMetas[i].value.pathName);
        notes.push(document)
      }
      setNotesList(notes);
    })();

  }, [publicTypeIndex]);

  return notesList;
}

export function getNotes(notesList: TripleDocument[]): TripleSubject[] {
  //return notesList.getSubjectsOfType(schema.TextDigitalDocument);
  let subjectsList = [] as TripleSubject[]
  notesList.forEach((note: TripleDocument) => {
    subjectsList.push(note.getSubjectsOfType(schema.TextDigitalDocument)[0])
  })
  return subjectsList
}


