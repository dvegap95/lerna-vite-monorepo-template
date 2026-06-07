import useMyButton, { type MyButtonProps } from './useMyButton';
export type { MyButtonProps } from './useMyButton';
import { Container } from './styledMyButton';

const MyButton = ({
  // props here
  className,
}: MyButtonProps) => {
  const { handleHover } = useMyButton();

  return (
    <Container className={className} onMouseEnter={handleHover}>
      MyButton
    </Container>
  );
};

export default MyButton;
