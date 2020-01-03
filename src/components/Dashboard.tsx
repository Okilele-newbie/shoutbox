import React from 'react';
import { LogoutButton } from '@solid/react';
import { NotesList } from './NotesList';


const container = {
  padding: '0.5rem 1rem 0.5rem 1rem',
  maxWidth: '60%'
}

const footer = {
  backgroundColor: '#fafafa',
  padding: '0 1.5rem 0'
};

export const Dashboard: React.FC = () => {
  return <>
    <div style={container}>
      <h1 style={{ fontSize: '2rem' }}>
        shoutbox
      </h1>
      <NotesList />
      <footer style={footer}>
        <div className="columns">
          <div className="column has-text-right">
            <LogoutButton className="button" />
          </div>
        </div>
      </footer>
    </div>
  </>;
};
