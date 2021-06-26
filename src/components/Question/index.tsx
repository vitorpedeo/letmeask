import './styles.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
};

const Question: React.FC<QuestionProps> = ({ children, content, author }) => {
  return (
    <div className="question">
      <p>{content}</p>

      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>

        <div>{children}</div>
      </footer>
    </div>
  );
};

export default Question;
