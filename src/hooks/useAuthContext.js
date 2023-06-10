import { AuthContext } from '../components/context/AuthContext';
import { useContext } from 'react';
// this hooks is so that we can use the authContext hooks without much code
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('context must be used inside an auth context provider');
  }

  // the context being returned contains the values
  return context;
}
