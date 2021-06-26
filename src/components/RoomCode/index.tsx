import copyImg from '../../assets/images/copy.svg';

import './styles.scss';

type RoomCodeProps = {
  code: string;
};

const RoomCode: React.FC<RoomCodeProps> = ({ code }) => {
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <button type="button" className="room-code" onClick={copyCodeToClipboard}>
      <div>
        <img src={copyImg} alt="Copiar código" />
      </div>

      <span>{code}</span>
    </button>
  );
};

export default RoomCode;
