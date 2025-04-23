// client/src/components/common/NavigationButton.tsx
import { useNavigate } from 'react-router-dom';
import Button, { ButtonProps } from '../Button';

interface NavigationButtonProps extends ButtonProps {
  to?: string; // Опциональный путь для внутренней навигации
  href?: string; // Опциональная внешняя ссылка
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  replace?: boolean;
}

const NavigationButton = ({ 
  to, 
  href,
  target = '_blank',
  rel = target === '_blank' ? 'noopener noreferrer' : undefined,
  replace = false,
  onClick,
  children, 
  ...buttonProps 
}: NavigationButtonProps) => {
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Сначала вызываем пользовательский onClick, если он предоставлен
    if (onClick) {
      onClick(event);
      if (event.defaultPrevented) return;
    }
    
    // Проверяем, какой тип ссылки используется
    if (to) {
      // Внутренняя навигация
      if (replace) {
        navigate(to, { replace: true });
      } else {
        navigate(to);
      }
    } else if (href) {
      // Внешняя ссылка
      window.open(href, target);
    }
  };

  return (
    <Button onClick={handleClick} {...buttonProps}>
      {children}
    </Button>
  );
};

export default NavigationButton;