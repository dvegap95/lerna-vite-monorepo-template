import emotionStyled from '@emotion/styled';

const Container = emotionStyled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
`;

function App() {
  return <Container>App</Container>;
}

export default App;
