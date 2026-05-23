import styled from 'styled-components';

function PaginationDots({ total, current, color }) {
  return (
    <Container aria-label="추천 코디 페이지" $color={color}>
      {Array.from({ length: total }).map((_, index) => (
        <Dot
          key={index}
          aria-label={`${index + 1}번째 코디`}
          aria-current={index === current ? 'true' : undefined}
          $active={index === current}
          $color={color}
        />
      ))}
    </Container>
  );
}

const Container = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 auto;
  padding: 4px 8px;
  border-radius: 999px;
  background: ${({ $color }) => `${$color ?? '#43474F'}33`};
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $active, $color }) =>
    $active ? ($color ?? '#43474F') : '#ffffff'};
  opacity: ${({ $active }) => ($active ? 1 : 0.9)};
`;

export default PaginationDots;
