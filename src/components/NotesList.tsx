import React from 'react';
import { addNote } from '../services/addNote';
import { getNotes, useNotesList } from '../hooks/useNotesList';
import { TripleSubject, TripleDocument } from 'tripledoc';
import { schema } from 'rdf-namespaces';
import { Note } from './Note';

const notesStyle = {
  height: '300px',
  overflow: 'auto',

};
const noteStyle = {
  padding: '0 20px 0 20px',
  marginTop: '0',
  paddingTop: '0'
};


export const NotesList: React.FC = () => {
  const notesList = useNotesList();
  const [formContent, setFormContent] = React.useState('');
  const [updatedNotesList, setUpdatedNotesList] = React.useState<TripleDocument[]>();

  if (!notesList) {
    return null;
  }
  const notes = getNotes(updatedNotesList || notesList);
  //Save note on main textarea
  async function saveNote(event: React.FormEvent) {
    event.preventDefault();
    if (!notesList) {
      return;
    }
    const updatedDoc = await addNote(formContent, notesList);
    setUpdatedNotesList(updatedDoc);

    const objDiv = document.getElementById("notesContainer");
    if (objDiv) {
      //objDiv.scrollTop = objDiv.scrollHeight;
      //objDiv.scrollTop = 1000//objDiv.scrollHeight - objDiv.clientHeight;
      setTimeout(function() {
        console.log(objDiv.scrollHeight);
        console.log(objDiv.scrollTop);
        objDiv.scrollTop = objDiv.scrollHeight;
     
        console.log(objDiv.scrollTop);
     }, 100);
    }

    setFormContent('');
  }

  async function editNote(content: string, note: TripleSubject) {
    //should save individual note and erload/update notesList (as array)
    /*
    const notesDocument = updatedNotesList || notesList;
    if (!notesDocument) {
      return;
    }

    note.setLiteral(schema.text, content);
    note.setLiteral(schema.dateModified, new Date(Date.now()));
    const updatedDoc = await notesDocument.save();
    setUpdatedNotesList(updatedDoc);
    return updatedDoc.getSubject(note.asRef());
    */
    return note
  }

  async function deleteNote(note: TripleSubject) {
    //should save individual note and erload/update notesList (as array)
    /*

    const notesDocument = updatedNotesList || notesList;
    if (!notesDocument) {
      return;
    }

    notesDocument.removeSubject(note.asRef());
    const updatedDoc = await notesDocument.save();
    setUpdatedNotesList(updatedDoc);
    */
  }

  const noteElements = notes.map((note) => (
    <div key={note.asRef()} style={noteStyle} id="notesContainer">
        {note.asRef().split('/')[2]}
        <Note
          note={note}
          onChange={(updatedContent) => editNote(updatedContent, note)}
        />
        <p className="has-text-right">
          <button
            aria-label="Delete this note"
            onClick={() => deleteNote(note)}
            title="Delete this note"
            className="button is-text"
            style={{ textDecoration: 'none' }}
          >🗙</button>
        </p>
    </div>
  ));

  return (
    <>
      <section>
        <div style={notesStyle}>
          {noteElements}
        </div>

        <form onSubmit={saveNote}>
          <div className="field">
            <div className="control">
              <textarea
                onChange={(e) => { e.preventDefault(); setFormContent(e.target.value); }}
                name="note"
                id="note"
                className="textarea"
                value={formContent}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-primary">Add note</button>
            </div>
          </div>
        </form>
      </section>

    </>
  );
};

/*
unused, done in CouchDb
function byDate(note1: TripleSubject, note2: TripleSubject): number {
  const date1 = note1.getDateTime(schema.dateCreated);
  const date2 = note2.getDateTime(schema.dateCreated);
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    return 0;
  }
  return date2.getTime() - date1.getTime();
}
*/
