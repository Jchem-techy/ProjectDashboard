import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
export default function useLogout() {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  // this update the to be use in the authContext.js
  const { dispatch } = useAuthContext();
  async function logout() {
    setError(null);
    setIsPending(true);
    try {
      await signOut(auth);
      dispatch({ type: 'LOGOUT' });
      setIsPending(false);
      if (!isCancel) {
        setError(null);
      }
    } catch (error) {
      console.log(error);
      if (!isCancel) {
        setError(error.message);
        setIsPending(false);
      }
    }
  }
  useEffect(() => {
    return () => setIsCancel(true);
  });
  return { logout, error, isPending };
}
