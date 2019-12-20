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
  let root = await FileUtils.getRoot() || ''
  const path = `/public/notepod/note${Math.floor(Date.now() / 1000)}.ttl`;
  const notesListRef = `${root}${path}`;
  const newNote = createDocument(notesListRef);
  const newNoteSubject = newNote.addSubject();
  newNoteSubject.addRef(rdf.type, schema.TextDigitalDocument);
  newNoteSubject.addLiteral(schema.text, note);
  newNoteSubject.addLiteral(schema.dateCreated, new Date(Date.now()))
  await newNote.save();
  //reload else asRef unknown for newNoteSubject
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

/*
import { TripleDocument } from 'tripledoc';
import { rdf, schema } from 'rdf-namespaces';

export async function addNote(note: string, notesList: TripleDocument): Promise<TripleDocument> {
  const newNote = notesList.addSubject();
  newNote.addRef(rdf.type, schema.TextDigitalDocument);
  newNote.addLiteral(schema.text, note);
  newNote.addLiteral(schema.dateCreated, new Date(Date.now()))

  return await notesList.save([newNote]);
}
*/