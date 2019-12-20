import React from 'react';
import { LogoutButton } from '@solid/react';
import { foaf } from 'rdf-namespaces';
import { useProfile } from '../hooks/useProfile';
import { NotesList } from './NotesList';


const container = {
  padding: '0.5rem 1rem 0.5rem 1rem',
  maxWidth: '50%'
}

const footer = {
  backgroundColor: '#fafafa',
  padding: '0 1.5rem 0'
};

export const Dashboard: React.FC = () => {
  const profile = useProfile();

  const name = (profile) ? profile.getString(foaf.name) : null;
  const title = (name)
    ? `Public notes by ${name}`
    : 'Public notes';

  return <>
    <div style={container}>
      <h1 style={{fontSize: '2rem'}}>
        shoutbox
      </h1>
      <NotesList />
      <footer style={footer}>
        <div className="columns">
          <p className="column content">
            <a
              href="https://gitlab.com/vincenttunru/notepod/"
              title="View the source code on GitLab"
            >Source code</a>
          </p>
          <div className="column has-text-right">
            <LogoutButton className="button" />
          </div>
        </div>
      </footer>
    </div>
  </>;
};
