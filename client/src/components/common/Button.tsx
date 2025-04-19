import { ReactNode } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, styled } from '@mui/material';

// Расширяем типы пропсов от Material UI Button
interface ButtonProps extends Omit<MuiButtonProps, 'color'> {
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default';
  size?: 'small' | 'medium' | 'large';
  variant?: 'text' | 'outlined' | 'contained';
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

// Создаем стилизованный компонент на основе MUI Button
const StyledButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 500,
  textTransform: 'none', // Убираем капитализацию текста
  boxShadow: 'none',
  '&:hover': {
    boxShadow: theme.shadows[1],
  },
  // Дополнительные кастомные стили
  padding: '8px 16px', // Настраиваем отступы
}));

// Кастомный компонент кнопки
const Button = ({
  children,
  color = 'default',
  size = 'medium',
  variant = 'contained',
  fullWidth = false,
  startIcon,
  endIcon,
  ...rest
}: ButtonProps) => {
  return (
    <StyledButton
      color={color as MuiButtonProps['color']}
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
