import { CSSProperties } from 'react';

type ImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

const Image = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  onClick,
}: ImageProps) => {
  // Преобразование числовых значений ширины и высоты в строки с 'px'
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  // Объединение переданных стилей с вычисленными значениями ширины и высоты
  const combinedStyle: CSSProperties = {
    width: widthStyle,
    height: heightStyle,
    objectFit: 'contain', // По умолчанию изображение будет содержаться полностью в заданных размерах
    ...style, // Передаем дополнительные стили, если они есть
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={combinedStyle}
      onClick={onClick}
    />
  );
};

export default Image;