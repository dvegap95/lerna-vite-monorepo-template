import styled from '@emotion/styled';

import { MyButton } from '@monorepo/common-lib';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export type AppProps = {
  basePath?: string;
};

function App(_props: AppProps) {
  return (
    <Container>
      <h1>___FTName___</h1>
      <MyButton />
    </Container>
  );
}

export default App;
