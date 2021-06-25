import React, { createContext, useContext, useEffect, useState } from 'react';

import { Firebase, auth } from '../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
};

interface IAuthContext {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext({} as IAuthContext);

export const useAuth = (): IAuthContext => useContext(AuthContext);

const AuthContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(findedUser => {
      if (findedUser) {
        const { uid, displayName, photoURL } = findedUser;

        if (!displayName || !photoURL) {
          throw new Error(
            'Missing information from Google Account. Please, try another account.',
          );
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new Firebase.auth.GoogleAuthProvider();

    try {
      const result = await auth.signInWithPopup(provider);

      if (result.user) {
        const { uid, displayName, photoURL } = result.user;

        if (!displayName || !photoURL) {
          throw new Error(
            'Missing information from Google Account. Please, try another account.',
          );
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      } else {
        throw new Error('User not found. Please, try another account.');
      }
    } catch (error) {
      //
    }
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
