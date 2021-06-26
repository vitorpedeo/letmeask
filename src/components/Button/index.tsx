import { ButtonHTMLAttributes } from 'react';

import './styles.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

const Button: React.FC<ButtonProps> = ({ isOutlined = false, ...rest }) => {
  // eslint-disable-next-line
  return <button className={`button ${isOutlined ? 'outlined' : ''}`} {...rest} />;
};

export default Button;
