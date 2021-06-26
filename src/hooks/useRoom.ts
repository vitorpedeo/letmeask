import { useEffect, useState } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { database } from '../services/firebase';

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
  likeCount: number;
  likeId: string | undefined;
};

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

type RoomHookType = (roomId: string) => {
  questions: Question[];
  title: string;
};

const useRoom: RoomHookType = (roomId: string) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(item => {
        const [key, value] = item;

        const likes = Object.values(value.likes ?? {});

        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: likes.length,
          likeId: Object.entries(value.likes ?? {}).find(
            ([likeKey, likeValue]) => likeValue.authorId === user?.id,
          )?.[0],
        };
      });

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });

    return () => {
      roomRef.off('value');
    };
  }, [roomId, user?.id]);

  return { questions, title };
};

export default useRoom;
