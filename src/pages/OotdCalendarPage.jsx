import { useRef, useState } from 'react';
import styled from 'styled-components';
import { useSeasonTheme } from '@/store/seasonThemeStore';
import outfitImage from '@/assets/hero.png';

const BASE_MONTH = new Date(2026, 5, 1);
const clothingImage = encodeURI(
  '/ChatGPT Image 2026년 6월 23일 오후 03_34_52.png',
);

const mockOotds = {
  1: {
    image: clothingImage,
    memo: '블랙 티셔츠로 깔끔하게 입은 날',
  },
  3: {
    image: outfitImage,
    memo: '가벼운 산책 코디',
  },
  8: {
    image: clothingImage,
    memo: '편하게 입은 데일리룩',
  },
  12: {
    image: clothingImage,
    memo: '소매 배색이 포인트라 단독으로 입기 좋았어요.',
  },
  17: {
    image: outfitImage,
    memo: '날씨가 좋아서 밝은 색으로 기록',
  },
  21: {
    image: outfitImage,
    memo: '실내 냉방까지 생각해서 얇은 니트를 선택',
  },
  25: {
    image: clothingImage,
    memo: '기본 티셔츠 OOTD',
  },
  29: {
    image: outfitImage,
    memo: '월말 코디 기록',
  },
};
const todayDay = 24;

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  })
    .format(date)
    .replace(',', '');
}

function buildCalendarCells(date) {
  const firstDay = date.getDay();
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();

  return [
    ...Array.from({ length: firstDay }, (_, index) => ({
      id: `blank-${index}`,
    })),
    ...Array.from({ length: daysInMonth }, (_, index) => ({
      id: index + 1,
      day: index + 1,
    })),
  ];
}

function OotdCalendarPage() {
  const { seasonTheme } = useSeasonTheme();
  const fileInputRef = useRef(null);
  const [ootds, setOotds] = useState(mockOotds);
  const [selectedDay, setSelectedDay] = useState(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const visibleMonth = new Date(
    BASE_MONTH.getFullYear(),
    BASE_MONTH.getMonth() + monthOffset,
    1,
  );
  const calendarCells = buildCalendarCells(visibleMonth);
  const selectedOotd = selectedDay ? ootds[selectedDay] : null;

  const handleDayClick = (day) => {
    if (!ootds[day]) return;
    setSelectedDay(day);
  };

  const handleMonthChange = (delta) => {
    setMonthOffset((currentOffset) => currentOffset + delta);
    setSelectedDay(null);
  };

  const handleAddClick = (event) => {
    event.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setOotds((currentOotds) => ({
      ...currentOotds,
      [todayDay]: {
        image: URL.createObjectURL(file),
        memo: '오늘의 OOTD',
      },
    }));
    setSelectedDay(todayDay);
    event.target.value = '';
  };

  return (
    <Page $background={seasonTheme.background}>
      <Title>O O T D  캘 린 더</Title>
      <CalendarCard $shadowColor={seasonTheme.primary}>
        <CalendarTop>
          <MonthButton
            type="button"
            aria-label="이전 달"
            onClick={() => handleMonthChange(-1)}
          >
            ‹
          </MonthButton>
          <MonthLabel>{formatMonthLabel(visibleMonth)}</MonthLabel>
          <MonthButton
            type="button"
            aria-label="다음 달"
            onClick={() => handleMonthChange(1)}
          >
            ›
          </MonthButton>
        </CalendarTop>
        <WeekHeader>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <WeekDay key={`${day}-${index}`}>{day}</WeekDay>
          ))}
        </WeekHeader>
        <DayGrid>
          {calendarCells.map((cell) => {
            if (!cell.day) {
              return <BlankDay key={cell.id} />;
            }

            const ootd = ootds[cell.day];
            const isCurrentMonth = monthOffset === 0;
            const canAddToday = isCurrentMonth && cell.day === todayDay && !ootd;
            return (
              <DayButton
                key={cell.day}
                type="button"
                $hasOotd={Boolean(ootd)}
                onClick={() => handleDayClick(cell.day)}
              >
                <DayNumber $hasOotd={Boolean(ootd)}>{cell.day}</DayNumber>
                {ootd ? (
                  <DayThumb src={ootd.image} alt={`${cell.day}일 OOTD`} />
                ) : canAddToday ? (
                  <AddPhotoButton
                    type="button"
                    aria-label="오늘 OOTD 사진 추가"
                    onClick={handleAddClick}
                    $primary={seasonTheme.primary}
                  >
                    +
                  </AddPhotoButton>
                ) : (
                  <EmptyDayMark />
                )}
              </DayButton>
            );
          })}
        </DayGrid>
      </CalendarCard>
      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {selectedOotd && (
        <ModalOverlay onMouseDown={() => setSelectedDay(null)}>
          <ModalCard onMouseDown={(event) => event.stopPropagation()}>
            <ModalImage
              src={selectedOotd.image}
              alt={`${selectedDay}일 OOTD 확대 사진`}
            />
            <ModalInfo>
              <ModalDate>06.{String(selectedDay).padStart(2, '0')}</ModalDate>
              <ModalMemo>{selectedOotd.memo}</ModalMemo>
            </ModalInfo>
            <CloseButton
              type="button"
              aria-label="닫기"
              onClick={() => setSelectedDay(null)}
            >
              ×
            </CloseButton>
          </ModalCard>
        </ModalOverlay>
      )}
    </Page>
  );
}

const Page = styled.section`
  min-height: calc(100% + 44px);
  display: grid;
  align-content: start;
  gap: 16px;
  margin: -20px -20px -24px;
  padding: 28px 14px 32px;
  background: ${({ $background }) => $background};
`;

const Title = styled.h2`
  margin: 0 0 4px 28px;
  color: #43474F;
  font-family: 'KyoboHandwriting2025lyb', sans-serif;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0;
`;

const CalendarCard = styled.section`
  display: grid;
  gap: 14px;
  padding: 22px 12px 20px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 8px 22px ${({ $shadowColor }) => `${$shadowColor}24`};
`;

const MonthLabel = styled.h3`
  margin: 0;
  color: #43474F;
  font-size: 20px;
  font-weight: 700;
`;

const CalendarTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
`;

const MonthButton = styled.button`
  width: 22px;
  height: 28px;
  display: grid;
  place-items: center;
  color: #43474F;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
`;

const WeekDay = styled.span`
  color: #8a93a3;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  border-top: 0.5px solid rgba(67, 71, 79, 0.28);
  border-left: 0.5px solid rgba(67, 71, 79, 0.28);
`;

const DayButton = styled.button`
  position: relative;
  aspect-ratio: 1 / 1.28;
  overflow: hidden;
  border-right: 0.5px solid rgba(67, 71, 79, 0.22);
  border-bottom: 0.5px solid rgba(67, 71, 79, 0.22);
  border-radius: 0;
  background: ${({ $hasOotd }) =>
    $hasOotd ? '#ffffff' : 'rgba(255, 255, 255, 0.18)'};
  color: ${({ theme }) => theme.colors.text};
  font-size: 11px;
`;

const DayNumber = styled.span`
  position: absolute;
  top: 4px;
  left: 5px;
  z-index: 1;
  padding: 0;
  background: transparent;
  color: #8a93a3;
  font-size: 12px;
  font-weight: 700;
`;

const DayThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AddPhotoButton = styled.button`
  position: absolute;
  inset: 8px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.52);
  color: #8a93a3;
  font-size: 28px;
  line-height: 1;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const BlankDay = styled.div`
  aspect-ratio: 1 / 1.28;
  border-right: 0.5px solid rgba(67, 71, 79, 0.28);
  border-bottom: 0.5px solid rgba(67, 71, 79, 0.28);
  background: rgba(255, 255, 255, 0.12);
`;

const EmptyDayMark = styled.span`
  position: absolute;
  inset: 0;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(17, 24, 39, 0.42);
`;

const ModalCard = styled.div`
  position: relative;
  width: min(320px, 100%);
  display: grid;
  overflow: hidden;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 18px 48px rgba(17, 24, 39, 0.24);
`;

const ModalImage = styled.img`
  width: 100%;
  max-height: 460px;
  object-fit: contain;
  background: #f3f4f6;
`;

const ModalInfo = styled.div`
  display: grid;
  gap: 4px;
  padding: 14px 16px 16px;
`;

const ModalDate = styled.span`
  color: #8a93a3;
  font-size: 12px;
`;

const ModalMemo = styled.p`
  margin: 0;
  color: #43474F;
  font-size: 14px;
  line-height: 1.45;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.82);
  color: #43474F;
  font-size: 22px;
  line-height: 1;
`;

export default OotdCalendarPage;
