import React from 'react';
import { Button as AntdButton } from 'antd';
import classNames from 'classnames';
import './Button.scss';
import { useRouter } from 'next/navigation';

const Button = ({
  className,
  size,
  shadow,
  type = 'primary',
  htmlType,
  title,
  danger,
  reverse,
  shape,
  link,
  disabled,
  target,
  icon,
  loading,
  onClick,
}) => {
  const router = useRouter();

  const handleClickButton = () => {
    if (link) {
      if (target) {
        window.open(link, target);
      } else {
        router.push(link);
      }
    } else onClick?.();
  };

  return (
    <div className={classNames('Button', className, { shadow, 'only-icon': !title && icon, reverse })}>
      <AntdButton
        size={size}
        type={type}
        shape={shape}
        icon={icon}
        htmlType={htmlType}
        onClick={handleClickButton}
        danger={danger}
        disabled={disabled}
        loading={loading}
      >
        {title && <span className="Button-title">{title}</span>}
      </AntdButton>
    </div>
  );
};

export default Button;
