import { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { database } from '../../services/firebase';

import Button from '../../components/Button';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import googleIconImg from '../../assets/images/google-icon.svg';

import './styles.scss';

const Home: React.FC = () => {
  const [roomId, setRoomId] = useState('');

  const { push } = useHistory();

  const { user, signInWithGoogle } = useAuth();

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWithGoogle();
    }

    push('/rooms/new');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomId(event.target.value);
  };

  const handleJoinRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (roomId.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomId}`).get();

    if (!roomRef.exists()) {
      alert('Sala não encontrada');

      return;
    }

    if (roomRef.val().endedAt) {
      alert('Sala finalizada');

      setRoomId('');

      return;
    }

    push(`/rooms/${roomId}`);
  };

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Perguntas e Respostas" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button
            type="button"
            className="create-room-btn"
            onClick={handleCreateRoom}
          >
            <img src={googleIconImg} alt="Google" />
            Cria sua sala com o Google
          </button>

          <div className="separator">ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomId}
              onChange={handleChange}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
