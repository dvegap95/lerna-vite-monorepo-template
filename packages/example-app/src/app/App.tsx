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

function App() {
  return (
    <Container>
      <h1>Example App</h1>
      <MyButton />
    </Container>
  );
}

export default App;
