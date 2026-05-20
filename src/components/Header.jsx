import styled from 'styled-components';

function Header() {
  return (
    <Container>
      <Title>WearWeather</Title>
    </Container>
  );
}

const Container = styled.header`
  height: calc(
    ${({ theme }) => theme.heights.header} + env(safe-area-inset-top)
  );
  display: flex;
  align-items: center;
  padding: 0 20px;
  padding-top: env(safe-area-inset-top);
  border-bottom: 1px solid #eef0f3;
  background: #ffffff;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  color: #111827;
`;

export default Header;
