import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { database } from '../../services/firebase';

import Button from '../../components/Button';
import RoomCode from '../../components/RoomCode';

import logoImg from '../../assets/images/logo.svg';

import './styles.scss';

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
  }
>;

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
};

type RoomParams = {
  id: string;
};

const Room: React.FC = () => {
  const { id: roomId } = useParams<RoomParams>();

  const [newQuestion, setNewQuestion] = useState('');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const { user } = useAuth();
  const isAuthenticated = !!user;

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(item => {
        const [key, value] = item;

        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
        };
      });

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
  }, [roomId]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewQuestion(event.target.value);
  };

  const handleSendQuestion = async (event: FormEvent) => {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  };

  const numberOfQuestions = questions.length;

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {numberOfQuestions > 0 && (
            <span>{numberOfQuestions} pergunta(s)</span>
          )}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você perguntar?"
            value={newQuestion}
            onChange={handleChange}
          />

          <div className="form-footer">
            {isAuthenticated ? (
              <div className="user-info">
                <img src={user?.avatar} alt={user?.name} />
                <span>{user?.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta,{' '}
                <button type="button">faça seu login</button>.
              </span>
            )}

            <Button type="submit" disabled={!isAuthenticated}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        <pre>{JSON.stringify(questions, null, 2)}</pre>
      </main>
    </div>
  );
};

export default Room;
