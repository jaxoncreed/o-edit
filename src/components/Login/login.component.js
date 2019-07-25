/* eslint-disable constructor-super */
import React from 'react';
import { Link } from 'react-router-dom';
import { ProviderLogin } from '@inrupt/solid-react-components';
import {
  LoginWrapper,
  LoginPanel,
  PanelBody,
  LoginTitle
} from './login.style.js';

const LoginComponent = props => {
  return (
    <LoginWrapper data-testid="login-wrapper">
      <div>
        <LoginPanel className={"login-panel"}>
          <img src="/img/OeditOrig.png" alt="Oedit Logo"
            style={{
              width: '300px',
              marginBottom: '20px',
              marginTop: '20px',
              alignSelf: 'center'
            }}
          />
          <PanelBody className={"panel-body"}>
            <Link
              className='ids-link-filled ids-link-filled--primary'
              to='/register'
            >
              Register for a Solid Identity
            </Link>
            <a
              href='https://solid.inrupt.com/get-a-solid-pod'
              rel='noopener noreferrer'
              target='_blank'
              className='link'
            >
              What is a Solid Identity?
            </a>
            <LoginTitle data-testid="login-title"> <span>Log In</span></LoginTitle>
            <ProviderLogin
              selectPlaceholder="Select ID Provider"
              inputPlaholder="WebID"
              formButtonText="Log In"
              btnTxtWebId="Log In with WebId"
              btnTxtProvider="Log In with Provider"
              className='provider-login-component'
              callbackUri={`${window.location.origin}/`}
              errorsText={{
                unknown: 'Something is wrong, please try again...',
                webIdNotValid: 'WeibID is not valid',
                emptyProvider: 'Solid Provider is required',
                emptyWebId: 'Valid WebID is required'
              }}
            />
          </PanelBody>
        </LoginPanel>
      </div>
    </LoginWrapper>
  );
};

export { LoginComponent };

export default LoginComponent;
