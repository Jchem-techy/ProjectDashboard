import { Reducer, useEffect, useReducer, useState } from 'react';
import { db, colRef, timestamp } from '../firebase/config';
import { addDoc, doc, deleteDoc } from 'firebase/firestore';
let initalState = {
  document: null,
  isPending: false,
  error: null,
  sucess: null,
};

function firestoreReducer(state, action) {
  if (action.type === 'IS_PENDING') {
    return { ...state, isPending: true };
  }
  if (action.type === 'ERROR') {
    return {
      ...state,
      isPending: false,
      sucess: false,
      error: action.payload,
      document: null,
    };
  }
  if (action.type === 'ADDED_DOCUMENT') {
    return {
      error: false,
      document: action.payload,
      isPending: false,
      sucess: true,
    };
  }
  if (action.type === 'DELETED_DOCUMENT') {
    return {
      error: null,
      document: action.payload,
      isPending: false,
      sucess: true,
    };
  }
  return state;
}

export default function useFirestore(collection) {
  const [response, dispatch] = useReducer(firestoreReducer, initalState);
  const [isCancelled, setIsCancelled] = useState(false);
  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };
  // add a new document
  const addDocument = async (doc) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const createdAt = timestamp;
      const addedDocument = await addDoc(colRef, { ...doc, createdAt });
      dispatchIfNotCancelled({
        type: 'ADDED_DOCUMENT',
        payload: addedDocument,
      });
    } catch (error) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: error.message });
    }
  };
  const deleteDocument = async (id) => {
    const deletedDocument = await deleteDoc(doc(db, 'transactions', id));
    dispatchIfNotCancelled({
      type: 'DELETED_DOCUMENT',
      payload: deletedDocument,
    });
  };

  useEffect(() => {
    return () => setIsCancelled(false);
  }, []);
  return { addDocument, deleteDocument, response };
}
