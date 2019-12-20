import React from 'react';
import { fetchDocument, TripleDocument, TripleSubject } from 'tripledoc';
import { solid, schema } from 'rdf-namespaces';
import { usePublicTypeIndex } from './usePublicTypeIndex';
//import { initialiseNotesList } from '../services/initialiseNotesList';
import MetaUtils, { Meta } from '../services/MetaUtils'

export function useNotesList() {
  const publicTypeIndex = usePublicTypeIndex();
  const [notesList, setNotesList] = React.useState<TripleDocument[]>();

  React.useEffect(() => {
    if (!publicTypeIndex) {
      return;
    }

    (async () => {
      const notesListIndex = publicTypeIndex.findSubject(solid.forClass, schema.TextDigitalDocument);
      if (!notesListIndex) {
        // If no notes document is listed in the public type index, create one:
        //const notesList = await initialiseNotesList()
        //if (notesList === null) {
        //  return;
        //}
        //setNotesList(notesList);
        return;
      } else {

        // ======================
        const centralMetas = await MetaUtils.getCentralMetas() as any[]
        let notes = [] as TripleDocument[] 
        for ( let i = 0; i < centralMetas.length ; i++) {
          const document = await fetchDocument('https://' + centralMetas[i].value.hostName + centralMetas[i].value.pathName);
          notes.push(document)
        }
        setNotesList(notes);
        //======================
        // If the public type index does list a notes document, fetch it:
        /*
        const notesListUrl = notesListIndex.getRef(solid.instance);
        if (typeof notesListUrl !== 'string') {
          return;
        }
        const document = await fetchDocument(notesListUrl);
        setNotesList(document);
        */
      }
    })();

  }, [publicTypeIndex]);

  return notesList;
}
/*
export function getNotes(notesList: TripleDocument): TripleSubject[] {
  return notesList.getSubjectsOfType(schema.TextDigitalDocument);
}
*/
export function getNotes(notesList: TripleDocument[]): TripleSubject[] {
  //return notesList.getSubjectsOfType(schema.TextDigitalDocument);
  let subjectsList = [] as TripleSubject[]
  notesList.map((note: TripleDocument) => {
    subjectsList.push(note.getSubjectsOfType(schema.TextDigitalDocument)[0])
  })
  return subjectsList
}


