import styled from 'styled-components';

function RetryButton({ color, onClick }) {
  return (
    <Button type="button" $color={color} onClick={onClick}>
      <Icon aria-hidden="true">↻</Icon>
      <Label>Retry</Label>
    </Button>
  );
}

const Button = styled.button`
  width: 72px;
  min-height: 98px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 4px;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  color: #ffffff;
  box-shadow: 2px 2px 10px 2px ${({ $color }) => `${$color}33`};
`;

const Icon = styled.span`
  font-size: 44px;
  line-height: 0.9;
`;

const Label = styled.span`
  font-size: 12px;
  line-height: 1;
`;

export default RetryButton;
