import styled from 'styled-components';

function OutfitCard({ imageSrc, title, color }) {
  return (
    <Card $color={color}>
      <Favorite aria-label="찜하기" $color={color}>
        ☆
      </Favorite>
      <Image src={imageSrc} alt={title} />
    </Card>
  );
}

const Card = styled.article`
  position: relative;
  width: min(346px, 100%);
  aspect-ratio: 346 / 442;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 2px 2px 8px 2px ${({ $color }) => `${$color}33`};
  overflow: hidden;
`;

const Favorite = styled.button`
  position: absolute;
  top: 16px;
  right: 18px;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ $color }) => $color};
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
`;

const Image = styled.img`
  width: 82%;
  height: 82%;
  object-fit: contain;
`;

export default OutfitCard;
