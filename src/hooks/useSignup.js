//  react imports
import React from 'react';
import { useState, useEffect } from 'react';

// hooks imports
import { useAuthContext } from './useAuthContext.js';

// firebase auth imports
import { auth } from '../firebase/config';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

export default function useSignup() {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  // this update the to be use in the authContext.js
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName) => {
    // await user.user.updateProfile({displayName})
    setError(null);
    setIsPending(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      console.log(user);
      if (!userCredentials) {
        throw new Error('Could not complete signup');
      }
      //adding display name(user name) to the user
      await updateProfile(auth.currentUser, { displayName: displayName });
      // dispatching the login event
      dispatch({ type: 'LOGIN', payload: user });
      setIsPending(false);
      if (!isCancel) {
        setError(null);
      }
    } catch (error) {
      console.log(error.message);
      if (!isCancel) {
        setError(error.message);
        setIsPending(false);
      }
    }
  };
  useEffect(() => {
    return () => setIsCancel(true);
  });

  return { error, isPending, signup };
}
