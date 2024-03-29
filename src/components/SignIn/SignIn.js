import React from 'react';
import { Helmet } from 'react-helmet';

import Spinner from '../Spinner/Spinner';

const SignIn = ({
  handleRouteChange,
  handleUsernameInputChange,
  handlePasswordInputChange,
  handleEnterKey,
  handleSignIn,
  windowMessage,
  input,
  loading,
}) => (
  <>
    <Helmet>
      <title>Sign In | CSBudget</title>
    </Helmet>
    <div className="relative mb3">
      <input
        className={`input input-indicator br3 pt4 ph3 pb2 w-100
          ${input.username.empty ? 'empty' : ''}
          `}
        onChange={handleUsernameInputChange}
        onKeyDown={handleEnterKey(handleSignIn)}
        type="text"
        maxLength={input.username.maxLength}
        required
      />
      <span className="floating-label">Username</span>
    </div>
    <div className="relative mb4">
      <input
        className={`input input-indicator br3 pt4 ph3 pb2 w-100
          ${input.password.empty ? 'empty' : ''}
          `}
        onChange={handlePasswordInputChange}
        onKeyDown={handleEnterKey(handleSignIn)}
        type="password"
        maxLength={input.password.maxLength}
        required
      />
      <span className="floating-label">Password</span>
    </div>

    {windowMessage ? (
      <h6 className="clr-red fs-body fw4 mv4">{windowMessage}</h6>
    ) : null}

    <button
      onClick={loading ? null : handleSignIn}
      className={`bg--semi-transparent selection-transparent clr-light fs-body fw7 bg--dark bn br3 pa3 mb3 w-100
      ${loading ? '' : 'pointer hover-opacity-75'}`}
    >
      {loading ? <Spinner /> : 'Sign In'}
    </button>
    <button
      onClick={() => handleRouteChange('sign-up')}
      className="clr-light fs-body fw3 bg-transparent bn pointer underline-hover"
    >
      Don't have an account? <span className="fw6">Sign up</span>.
    </button>
  </>
);

export default SignIn;
