import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useSeasonTheme } from '@/store/seasonThemeStore';

const STORAGE_KEY = 'wear-weather-style-preferences';

const questions = [
  {
    id: 'coldSensitivity',
    title: '추위를 많이 타는 편인가요?',
    options: [
      { label: '많이 타요', value: '추위 많이 탐' },
      { label: '조금 타요', value: '추위 조금 탐' },
      { label: '잘 안 타요', value: '추위 덜 탐' },
    ],
  },
  {
    id: 'sunSensitivity',
    title: '햇빛이나 자외선은 어떤 편인가요?',
    options: [
      { label: '햇빛 알러지 있어요', value: '햇빛 알러지' },
      { label: '선크림은 꼭 써요', value: '햇빛 민감' },
      { label: '크게 상관없어요', value: '햇빛 보통' },
    ],
  },
  {
    id: 'stylePreference',
    title: '더 자주 고르는 스타일은 무엇인가요?',
    options: [
      { label: '스트릿', value: '스트릿' },
      { label: '캐주얼', value: '캐주얼' },
      { label: '미니멀', value: '미니멀' },
      { label: '페미닌', value: '페미닌' },
    ],
  },
  {
    id: 'fitPreference',
    title: '선호하는 핏을 골라주세요.',
    options: [
      { label: '오버핏', value: '오버핏' },
      { label: '적당히 여유', value: '적당히 여유' },
      { label: '딱 맞는 핏', value: '슬림핏' },
      { label: '편한 핏', value: '편한 핏' },
    ],
  },
  {
    id: 'colorPreference',
    title: '더 끌리는 색감은 무엇인가요?',
    options: [
      { label: '밝은 톤', value: '밝은 톤' },
      { label: '어두운 톤', value: '어두운 톤' },
      { label: '뉴트럴', value: '뉴트럴' },
      { label: '포인트 색', value: '포인트 색' },
    ],
  },
  {
    id: 'moodPreference',
    title: '자주 고르는 무드는 어떤 쪽인가요?',
    options: [
      { label: '꾸안꾸', value: '꾸안꾸' },
      { label: '힙한 느낌', value: '힙' },
      { label: '단정한 느낌', value: '단정' },
      { label: '편안한 느낌', value: '편안' },
    ],
  },
];

const initialAnswers = questions.reduce((acc, question) => {
  acc[question.id] = '';
  return acc;
}, {});

function loadSavedState() {
  if (typeof window === 'undefined') return { step: 0, answers: initialAnswers };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { step: 0, answers: initialAnswers };

    const parsed = JSON.parse(raw);
    return {
      step: Number.isFinite(parsed.step) ? parsed.step : 0,
      answers: { ...initialAnswers, ...(parsed.answers ?? {}) },
    };
  } catch {
    return { step: 0, answers: initialAnswers };
  }
}

function StylePreferencesPage() {
  const { seasonTheme } = useSeasonTheme();
  const savedState = useMemo(() => loadSavedState(), []);
  const [step, setStep] = useState(savedState.step);
  const [answers, setAnswers] = useState(savedState.answers);

  const currentQuestion = questions[step];
  const selectedValue = answers[currentQuestion?.id ?? ''];
  const isComplete = step >= questions.length;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ step, answers }),
    );
  }, [answers, step]);

  const selectedItems = questions
    .map((question) => answers[question.id])
    .filter(Boolean);

  const handleSelect = (value) => {
    if (!currentQuestion) return;

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    setStep(questions.length);
  };

  const handleBack = () => {
    if (step === 0) return;

    if (isComplete) {
      setStep(questions.length - 1);
      return;
    }

    setStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setAnswers(initialAnswers);
    setStep(0);
  };

  return (
    <Page $background={seasonTheme.background}>
      <TitleRow>
        <BackButton type="button" onClick={handleBack} disabled={step === 0}>
          <BackArrow aria-hidden="true">‹</BackArrow>
        </BackButton>
        <Title>스 타 일  취 향  설 정</Title>
        <Spacer aria-hidden="true" />
      </TitleRow>

      {!isComplete ? (
        <QuestionPanel $shadowColor={seasonTheme.primary}>
          <ProgressRow>
            <ProgressText>{step + 1} / {questions.length}</ProgressText>
            <ProgressTrack aria-hidden="true">
              <ProgressBar
                $primary={seasonTheme.primary}
                $progress={((step + 1) / questions.length) * 100}
              />
            </ProgressTrack>
          </ProgressRow>

          <QuestionTitle>{currentQuestion.title}</QuestionTitle>

          <OptionGrid>
            {currentQuestion.options.map((option) => {
              const active = selectedValue === option.value;

              return (
                <OptionButton
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  $active={active}
                  $primary={seasonTheme.primary}
                >
                  {option.label}
                </OptionButton>
              );
            })}
          </OptionGrid>

          <ActionRow>
            <GhostButton
              type="button"
              onClick={handleBack}
              disabled={step === 0}
            >
              이전
            </GhostButton>
            <PrimaryButton
              type="button"
              onClick={handleNext}
              disabled={!selectedValue}
              $primary={seasonTheme.primary}
            >
              다음
            </PrimaryButton>
          </ActionRow>
        </QuestionPanel>
      ) : (
        <ResultPanel $shadowColor={seasonTheme.primary}>
          <ResultTitle>취향이 정리됐어요</ResultTitle>
          <ResultSubtitle>선택한 값들을 바탕으로 추천 기준을 만들 수 있어요.</ResultSubtitle>

          <ResultTags>
            {selectedItems.map((item) => (
              <ResultTag key={item} $primary={seasonTheme.primary}>
                {item}
              </ResultTag>
            ))}
          </ResultTags>

          <ResultList>
            {questions.map((question) => (
              <ResultRow key={question.id}>
                <ResultLabel>{question.title}</ResultLabel>
                <ResultValue>{answers[question.id]}</ResultValue>
              </ResultRow>
            ))}
          </ResultList>

          <ActionRow>
            <GhostButton type="button" onClick={handleReset}>
              다시하기
            </GhostButton>
            <PrimaryButton
              type="button"
              onClick={() => setStep(0)}
              $primary={seasonTheme.primary}
            >
              처음으로
            </PrimaryButton>
          </ActionRow>
        </ResultPanel>
      )}
    </Page>
  );
}

const Page = styled.section`
  min-height: calc(100% + 44px);
  display: grid;
  align-content: start;
  gap: 20px;
  margin: -20px -20px -24px;
  padding: 28px 20px 32px;
  background: ${({ $background }) => $background};
`;

const TitleRow = styled.div`
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) 28px;
  align-items: center;
  gap: 8px;
`;

const BackButton = styled.button`
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.text};
  opacity: ${({ disabled }) => (disabled ? 0.35 : 1)};

  &:disabled {
    cursor: default;
  }
`;

const BackArrow = styled.span`
  display: block;
  transform: translateY(-1px);
  font-size: 28px;
  line-height: 1;
`;

const Spacer = styled.span`
  width: 28px;
  height: 28px;
`;

const Title = styled.h2`
  margin: 0;
  color: #43474F;
  font-family: 'KyoboHandwriting2025lyb', sans-serif;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0;
  text-align: center;
`;

const QuestionPanel = styled.section`
  display: grid;
  gap: 22px;
  padding: 22px 20px 24px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 22px ${({ $shadowColor }) => `${$shadowColor}29`};
`;

const ProgressRow = styled.div`
  display: grid;
  gap: 8px;
`;

const ProgressText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 500;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(102, 183, 139, 0.12);
`;

const ProgressBar = styled.div`
  width: ${({ $progress }) => `${$progress}%`};
  height: 100%;
  border-radius: 999px;
  background: ${({ $primary }) => $primary};
`;

const QuestionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 21px;
  line-height: 1.35;
  font-weight: 600;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const OptionButton = styled.button`
  min-height: 56px;
  padding: 10px 12px;
  border: 1px solid ${({ $primary }) => $primary};
  border-radius: 8px;
  background: ${({ $active, $primary }) =>
    $active ? $primary : 'rgba(255, 255, 255, 0.92)'};
  color: ${({ $active, $primary }) => ($active ? '#ffffff' : $primary)};
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  text-align: center;
`;

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding-top: 2px;
`;

const GhostButton = styled.button`
  height: 44px;
  border: 1px solid #dbe3df;
  border-radius: 8px;
  background: #ffffff;
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 500;

  &:disabled {
    opacity: 0.45;
  }
`;

const PrimaryButton = styled.button`
  height: 44px;
  border-radius: 8px;
  background: ${({ $primary }) => $primary};
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;

  &:disabled {
    opacity: 0.45;
  }
`;

const ResultPanel = styled.section`
  display: grid;
  gap: 16px;
  padding: 22px 20px 24px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 22px ${({ $shadowColor }) => `${$shadowColor}29`};
`;

const ResultTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 22px;
  line-height: 1.2;
  font-weight: 600;
`;

const ResultSubtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  line-height: 1.5;
  opacity: 0.82;
`;

const ResultTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ResultTag = styled.span`
  padding: 7px 10px;
  border-radius: 999px;
  background: ${({ $primary }) => `${$primary}1F`};
  color: ${({ $primary }) => $primary};
  font-size: 13px;
  font-weight: 600;
`;

const ResultList = styled.div`
  display: grid;
  gap: 10px;
  padding-top: 4px;
`;

const ResultRow = styled.div`
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid #eef0f3;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
`;

const ResultLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 500;
  opacity: 0.78;
`;

const ResultValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 600;
`;

export default StylePreferencesPage;
