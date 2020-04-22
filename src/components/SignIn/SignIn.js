import React from 'react';

import '../../base/loginBox.scss';

const SignIn = () => {
  return (
    <div className="flex justify-center">
      <div className="login-box tc pt4 pb3 ph5">
        <h2 className="logo tc mb5">CSBudget</h2>
        <input
          className="placeholder"
          type="text"
          id="email"
          name="email"
          placeholder="Email"
        />
        <input
          className="placeholder"
          type="text"
          id="password"
          name="password"
          placeholder="Password"
        />
        <input className="subtitle b white" type="submit" value="Sign in" />
        <p className="subtitle pointer mt2 mb5 dim">Sign up</p>
        <p className="continue-as-guest pointer dim">Continue as guest</p>
      </div>
    </div>
  );
};

export default SignIn;
