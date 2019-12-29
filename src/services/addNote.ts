import { rdf, schema } from 'rdf-namespaces';
import { TripleDocument } from 'tripledoc';
import { createDocument, fetchDocument } from 'tripledoc';
import { addToTypeIndex } from './addToTypeIndex';
import { fetchProfile } from './fetchProfile';
import { fetchPublicTypeIndex } from './fetchPublicTypeIndex';
import FileUtils from './FileUtils';
import MetaUtils from './MetaUtils'

export async function addNote(note: string, notesList: TripleDocument[]): Promise<TripleDocument[]> {

  //TTL file
  FileUtils.checkNotesFolder()
  let root = await FileUtils.getRoot() || ''
  const path = `/public/shoutbox/note${Math.floor(Date.now() / 1000)}.ttl`;
  const notesListRef = `${root}${path}`;
  const newNote = createDocument(notesListRef);
  const newNoteSubject = newNote.addSubject();
  newNoteSubject.addRef(rdf.type, schema.TextDigitalDocument);
  newNoteSubject.addLiteral(schema.text, note);
  newNoteSubject.addLiteral(schema.dateCreated, new Date(Date.now()))
  await newNote.save();
  //reload else asRef is unknown for newNoteSubject
  const document = await fetchDocument(newNote.asRef());
  notesList.push(document)

  //TTL public index
  const [profile, publicTypeIndex] = await Promise.all([fetchProfile(), fetchPublicTypeIndex()]);
  if (profile !== null && publicTypeIndex !== null) {
    await addToTypeIndex(publicTypeIndex, newNote, schema.TextDigitalDocument);
  }
  
  //Meta on local and central
  MetaUtils.createMeta(notesListRef)

  return notesList
}
