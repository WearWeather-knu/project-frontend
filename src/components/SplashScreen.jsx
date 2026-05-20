import styled from 'styled-components';
import splashLogo from '@/assets/스플래시 로고.png';

function SplashScreen() {
  return (
    <Container>
      <Logo src={splashLogo} alt="WearWeather" />
    </Container>
  );
}

const Container = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background:
    linear-gradient(175deg, rgba(245, 159, 169, 0.3) 0%, rgba(240, 176, 104, 0.1) 25%, rgba(255, 255, 255, 0.3) 50%, rgba(240, 217, 104, 0.1) 77%, rgba(163, 221, 242, 0.2) 100%);
`;

const Logo = styled.img`
  width: max(320px, 50%);
  height: auto;
  display: block;
  object-fit: contain;
`;

export default SplashScreen;
