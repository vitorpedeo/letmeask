import { useHistory, useParams } from 'react-router-dom';

import useRoom from '../../hooks/useRoom';
import { database } from '../../services/firebase';

import Button from '../../components/Button';
import RoomCode from '../../components/RoomCode';
import Question from '../../components/Question';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';

import './styles.scss';

type RoomParams = {
  id: string;
};

const AdminRoom: React.FC = () => {
  const { id: roomId } = useParams<RoomParams>();
  const { push } = useHistory();

  const { questions, title } = useRoom(roomId);

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  };

  const handleEndRoom = async () => {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    push('/');
  };

  const numberOfQuestions = questions.length;

  return (
    <div id="admin-page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {numberOfQuestions > 0 && (
            <span>{numberOfQuestions} pergunta(s)</span>
          )}
        </div>

        <div className="question-list">
          {questions.map(question => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
            >
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Deletar pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminRoom;
