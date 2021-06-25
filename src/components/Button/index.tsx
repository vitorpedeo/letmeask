import { ButtonHTMLAttributes } from 'react';

import './styles.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = props => {
  // eslint-disable-next-line
  return <button className="button" {...props} />;
};

export default Button;
