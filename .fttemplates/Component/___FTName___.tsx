import use___FTName___, { type ___FTName___Props } from './use___FTName___';
export type { ___FTName___Props } from './use___FTName___';
import { Container } from './styled___FTName___';

const ___FTName___ = ({
  // props here
  className,
}: ___FTName___Props) => {
  const { handleHover } = use___FTName___();

  return (
    <Container className={className} onMouseEnter={handleHover}>
      ___FTName___
    </Container>
  );
};

export default ___FTName___;
