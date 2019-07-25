import React, { Component } from 'react';
import Monaco, { DiffEditor as MonacoDiffEditor } from '@monaco-editor/react';

import { withWebId, UpdateContext, withAuthorization } from '@inrupt/solid-react-components';
import { EditorWrapper, EditorHeader, EditorContent, Logo, NavSection } from './editor.style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons'
import ProfileImage from '../Share/ProfileImage';

class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      content: 'Moses supposes his toesis are roses',
      changesToCompare: false,
      unsavedChanges: false,
      compareMode: true,
      originalContent: 'Moses supposes his toesis arent roses'
    }
  }

  render() {

    return (
      <EditorWrapper>
        <EditorHeader>
          <NavSection>
            <Logo src="/img/OeditOrig.png" />
            <FontAwesomeIcon icon={faSave} style={{
              fontSize: '20px',
              color: this.state.unsavedChanges ? '#73b8fc' : '#666',
              marginLeft: '16px',
              cursor: this.state.unsavedChanges ? 'pointer' : 'arrow',
            }} />
          </NavSection>
          <NavSection>
            {this.state.changesToCompare ? (
              <button style={{
                marginRight: '16px'
              }}>
                New changes were made to this file. Compare changes?
              </button>
            ) : '' }
            <ProfileImage />
          </NavSection>
        </EditorHeader>
        <EditorContent>
          {this.state.compareMode ? (
            <MonacoDiffEditor
              theme={'dark'}
              language={'none'}
              original={this.state.originalContent}
              modified={this.state.content}
              editorDidMount={() => console.log('mounted')}
              loading={'Loading...'}
            />
          ) : (
            <Monaco
              theme={'dark'}
              language={'none'}
              value={this.state.content}
              editorDidMount={() => console.log('mounted')}
              loading={'Loading...'}
            />
          )}
        </EditorContent>
      </EditorWrapper>
    );
  }
}
Editor.contextType = UpdateContext;

export default withAuthorization(withWebId(Editor));
