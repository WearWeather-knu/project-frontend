import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useSeasonTheme } from '@/store/seasonThemeStore';
import closetArtwork from '@/assets/CLOSET.png';

const closetCategories = [
  {
    key: 'outer',
    label: '아우터',
    area: 'outer',
    hasHanger: true,
    layout: { left: 0, top: 0, width: 50, height: 26 },
  },
  {
    key: 'top',
    label: '상의',
    area: 'top',
    hasHanger: true,
    layout: { left: 0, top: 26, width: 50, height: 26 },
  },
  {
    key: 'bottom',
    label: '하의',
    area: 'bottom',
    hasHanger: true,
    layout: { left: 0, top: 52, width: 50, height: 48 },
  },
  {
    key: 'dress',
    label: '원피스',
    area: 'dress',
    hasHanger: true,
    layout: { left: 50, top: 24, width: 50, height: 62 },
  },
  {
    key: 'accessory',
    label: '액세서리',
    area: 'accessory',
    layout: { left: 50, top: 0, width: 50, height: 12 },
  },
  {
    key: 'bag',
    label: '가방',
    area: 'bag',
    layout: { left: 50, top: 12, width: 50, height: 12 },
  },
  {
    key: 'shoes',
    label: '신발',
    area: 'shoes',
    layout: { left: 50, top: 86, width: 50, height: 14 },
  },
];

const categoryLabels = closetCategories.map((category) => category.label);
const spacedCategoryLabels = {
  아우터: '아 우 터',
  상의: '상 의',
  하의: '하 의',
  액세서리: '액 세 서 리',
  가방: '가 방',
  원피스: '원 피 스',
  신발: '신 발',
  전체: '전 체',
};
const categoryByKey = Object.fromEntries(
  closetCategories.map((category) => [category.key, category]),
);
const allCategory = { key: 'all', label: '전체' };
const categoryKeyByLabel = Object.fromEntries(
  closetCategories.map((category) => [category.label, category.key]),
);
const seasonOptions = ['봄', '여름', '가을', '겨울', '사계절'];
const lengthOptions = ['롱', '숏', '크롭'];
const materialOptions = ['면', '청', '니트', '폴리', '가죽', '기타'];
const colorOptions = [
  '화이트',
  '블랙',
  '그레이',
  '브라운',
  '블루',
  '핑크',
  '그린',
  '레드',
  '베이지',
  '옐로우',
  '네이비',
  '퍼플',
  '스카이블루',
  '오렌지',
  '민트',
  '카키',
  '버건디',
  '기타',
];

const colorMap = {
  화이트: '#F8FAFC',
  블랙: '#111827',
  그레이: '#9CA3AF',
  브라운: '#8B5E3C',
  블루: '#3B82F6',
  핑크: '#F9A8D4',
  그린: '#22C55E',
  레드: '#EF4444',
  베이지: '#EAD7B7',
  옐로우: '#FACC15',
  네이비: '#31326F',
  퍼플: '#8B5CF6',
  스카이블루: '#7DD3FC',
  오렌지: '#F97316',
  민트: '#5EEAD4',
  카키: '#6B7280',
  버건디: '#7F1D1D',
};

const fallbackColor = '#D8DEE9';
const defaultClothingImage = encodeURI(
  '/ChatGPT Image 2026년 6월 23일 오후 03_34_52.png',
);
const lightColorValues = new Set(['#ffffff', '#fff', '#f8fafc', '#f4f5f7']);
const isLightColor = (color) => lightColorValues.has(color.toLowerCase());

const initialForm = {
  name: '',
  category: '상의',
  seasons: [],
  colorNames: ['화이트'],
  customColorName: '',
  imageUrl: '',
  length: '롱',
  material: '면',
};

const closetItems = [
  {
    id: 1,
    name: '아이보리 니트',
    category: '상의',
    seasons: ['봄', '가을'],
    weather: '12°~18°',
    color: '#F6E8D7',
  },
  {
    id: 2,
    name: '라이트 데님',
    category: '하의',
    seasons: ['봄', '여름', '가을'],
    weather: '16°~24°',
    color: '#9DB7D5',
  },
  {
    id: 3,
    name: '네이비 트렌치',
    category: '아우터',
    seasons: ['봄', '가을'],
    weather: '10°~17°',
    color: '#31326F',
  },
  {
    id: 4,
    name: '화이트 스니커즈',
    category: '신발',
    seasons: ['사계절'],
    weather: '맑은 날',
    color: '#F4F5F7',
  },
  {
    id: 5,
    name: '실버 미니백',
    category: '가방',
    seasons: ['사계절'],
    weather: '외출용',
    color: '#D8DEE9',
  },
  {
    id: 6,
    name: '블랙 슬랙스',
    category: '하의',
    seasons: ['봄', '가을', '겨울'],
    weather: '8°~19°',
    color: '#222831',
  },
];

function ClosetPage() {
  const navigate = useNavigate();
  const { category } = useParams();
  const { seasonTheme } = useSeasonTheme();
  const selectedCategory =
    category === allCategory.key ? allCategory : category ? categoryByKey[category] : null;
  const [items, setItems] = useState(closetItems);
  const [likedItemIds, setLikedItemIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return [];
    if (selectedCategory.key === allCategory.key) return items;

    return items.filter((item) => item.category === selectedCategory.label);
  }, [items, selectedCategory]);

  const closeModal = useCallback(() => {
    setForm(initialForm);
    setError('');
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal, isModalOpen]);

  if (category && !selectedCategory) {
    return <Navigate to="/closet" replace />;
  }

  const openModal = () => {
    setForm({
      ...initialForm,
      category:
        selectedCategory && selectedCategory.key !== allCategory.key
          ? selectedCategory.label
          : initialForm.category,
    });
    setError('');
    setIsModalOpen(true);
  };

  const updateForm = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const toggleSeason = (season) => {
    setForm((currentForm) => {
      const isSelected = currentForm.seasons.includes(season);

      return {
        ...currentForm,
        seasons: isSelected
          ? currentForm.seasons.filter((currentSeason) => currentSeason !== season)
          : [...currentForm.seasons, season],
      };
    });
  };

  const toggleColor = (colorName) => {
    setForm((currentForm) => {
      const isSelected = currentForm.colorNames.includes(colorName);

      return {
        ...currentForm,
        colorNames: isSelected
          ? currentForm.colorNames.filter(
              (currentColorName) => currentColorName !== colorName,
            )
          : [...currentForm.colorNames, colorName],
      };
    });
  };

  const toggleLikedItem = (itemId) => {
    setLikedItemIds((currentLikedItemIds) =>
      currentLikedItemIds.includes(itemId)
        ? currentLikedItemIds.filter((currentItemId) => currentItemId !== itemId)
        : [...currentLikedItemIds, itemId],
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.category) {
      setError('옷 이름과 종류를 입력해 주세요.');
      return;
    }

    const seasons = form.seasons.length > 0 ? form.seasons : ['사계절'];
    const selectedColorNames =
      form.colorNames.length > 0 ? form.colorNames : ['화이트'];
    const colorNames = selectedColorNames.map((selectedColorName) =>
      selectedColorName === '기타'
        ? form.customColorName.trim() || '기타'
        : selectedColorName,
    );
    const colors = selectedColorNames.map(
      (selectedColorName) => colorMap[selectedColorName] ?? fallbackColor,
    );

    const newItem = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      seasons,
      colors,
      color: colors[0] ?? fallbackColor,
      colorNames,
      colorName: colorNames[0] ?? '화이트',
      imageUrl: form.imageUrl.trim(),
      length: form.length,
      material: form.material,
      weather: `${form.length} · ${form.material}`,
    };

    setItems((currentItems) => [newItem, ...currentItems]);
    setForm(initialForm);
    setError('');
    setIsModalOpen(false);

    const nextCategoryKey = categoryKeyByLabel[form.category];
    if (category !== allCategory.key && nextCategoryKey && nextCategoryKey !== category) {
      navigate(`/closet/${nextCategoryKey}`);
    }
  };

  if (!selectedCategory) {
    return (
      <ClosetHomeView
        seasonTheme={seasonTheme}
        onSelect={(key) => navigate(`/closet/${key}`)}
      />
    );
  }

  return (
    <ClosetCategoryView
      category={selectedCategory}
      seasonTheme={seasonTheme}
      items={filteredItems}
      likedItemIds={likedItemIds}
      form={form}
      error={error}
      isModalOpen={isModalOpen}
      onChangeCategory={(categoryKey) => navigate(`/closet/${categoryKey}`)}
      onOpenModal={openModal}
      onCloseModal={closeModal}
      onUpdateForm={updateForm}
      onToggleSeason={toggleSeason}
      onToggleColor={toggleColor}
      onToggleLikedItem={toggleLikedItem}
      onSubmit={handleSubmit}
    />
  );
}

function ClosetHomeView({ seasonTheme, onSelect }) {
  return (
    <HomePage $background={seasonTheme.background} $primary={seasonTheme.primary}>
      <WardrobeCard>
        <WardrobeCanvas>
          <WardrobeImage src={closetArtwork} alt="" aria-hidden="true" />
          {closetHotspots.map((hotspot) => (
            <WardrobeHotspot
              key={hotspot.key}
              type="button"
              aria-label={`${hotspot.label} 보기`}
              $area={hotspot.area}
              onClick={() => onSelect(hotspot.key)}
            />
          ))}
        </WardrobeCanvas>
      </WardrobeCard>
    </HomePage>
  );
}

const closetHotspots = [
  { key: 'outer', label: '아우터', area: 'outer' },
  { key: 'top', label: '상의', area: 'top' },
  { key: 'bottom', label: '하의', area: 'bottom' },
  { key: 'dress', label: '원피스', area: 'dress' },
  { key: 'accessory', label: '액세서리', area: 'accessory' },
  { key: 'bag', label: '가방', area: 'bag' },
  { key: 'shoes', label: '신발', area: 'shoes' },
];

function CustomSelect({
  ariaLabel,
  value,
  options,
  onChange,
  width = '100%',
  placement = 'down',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel =
    spacedCategoryLabels[selectedOption?.label] ?? selectedOption?.label ?? '';

  const handleSelect = (nextValue) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <CustomSelectBox $width={width}>
      <CustomSelectButton
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <CustomSelectText>{selectedLabel}</CustomSelectText>
        <CustomSelectChevron aria-hidden="true" $open={isOpen} />
      </CustomSelectButton>
      {isOpen && (
        <CustomOptionList role="listbox" $placement={placement}>
          {options.map((option) => (
            <CustomOptionItem
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              $active={option.value === value}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </CustomOptionItem>
          ))}
        </CustomOptionList>
      )}
    </CustomSelectBox>
  );
}

function ClosetCategoryView({
  category,
  seasonTheme,
  items,
  likedItemIds,
  form,
  error,
  isModalOpen,
  onChangeCategory,
  onOpenModal,
  onCloseModal,
  onUpdateForm,
  onToggleSeason,
  onToggleColor,
  onToggleLikedItem,
  onSubmit,
}) {
  const [isColorSelectOpen, setIsColorSelectOpen] = useState(false);
  const selectedColorText =
    form.colorNames.length > 0 ? form.colorNames.join(', ') : '색상 선택';

  const handleOpenModal = () => {
    setIsColorSelectOpen(false);
    onOpenModal();
  };

  const handleCloseModal = () => {
    setIsColorSelectOpen(false);
    onCloseModal();
  };

  const handleSubmit = (event) => {
    setIsColorSelectOpen(false);
    onSubmit(event);
  };

  return (
    <Page $background={seasonTheme.background} $primary={seasonTheme.primary}>
      <CategoryHeader>
        <CategoryTitle>C L O S E T</CategoryTitle>
        <CustomSelect
          ariaLabel="옷 종류 선택"
          value={category.key}
          width="96px"
          options={[
            { value: allCategory.key, label: allCategory.label },
            ...closetCategories.map((closetCategory) => ({
              value: closetCategory.key,
              label: closetCategory.label,
            })),
          ]}
          onChange={onChangeCategory}
        />
      </CategoryHeader>

      {items.length > 0 ? (
        <ClosetGrid>
          {items.map((item) => {
            const itemColors = item.colors ?? [item.color ?? fallbackColor];
            const isLiked = likedItemIds.includes(item.id);

            return (
              <ClosetCard key={item.id}>
                <ItemImage
                  src={item.imageUrl || defaultClothingImage}
                  alt={item.name}
                />
                <LikeButton
                  type="button"
                  aria-label={`${item.name} 좋아요${isLiked ? ' 해제' : ''}`}
                  aria-pressed={isLiked}
                  $active={isLiked}
                  onClick={() => onToggleLikedItem(item.id)}
                >
                  <HeartIcon />
                </LikeButton>
                <ColorDotRow aria-label="선택한 색상">
                  {itemColors.map((color, index) => (
                    <ColorDot
                      key={`${item.id}-${color}-${index}`}
                      $color={color}
                      $isLight={isLightColor(color)}
                    />
                  ))}
                </ColorDotRow>
              </ClosetCard>
            );
          })}
        </ClosetGrid>
      ) : (
        <EmptyState>
          <EmptyTitle $textColor={seasonTheme.text}>
            아직 등록된 옷이 없어요.
          </EmptyTitle>
          <EmptyText>오른쪽 아래 + 버튼으로 새 옷을 추가할 수 있어요.</EmptyText>
        </EmptyState>
      )}

      <FloatingAddButton
        type="button"
        aria-label="옷 추가"
        onClick={handleOpenModal}
      />

      {isModalOpen && (
        <ModalOverlay onMouseDown={handleCloseModal}>
          <ModalPanel
            role="dialog"
            aria-modal="true"
            aria-labelledby="closet-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle id="closet-modal-title">옷 추가</ModalTitle>
              <CloseButton
                type="button"
                aria-label="닫기"
                onClick={handleCloseModal}
              >
                ×
              </CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <Field>
                <Label htmlFor="item-name">옷 이름</Label>
                <TextInput
                  id="item-name"
                  value={form.name}
                  onChange={(event) => onUpdateForm('name', event.target.value)}
                  placeholder="예: 아이보리 반팔 셔츠"
                />
              </Field>

              <Field>
                <Label as="span">옷 종류</Label>
                <CustomSelect
                  ariaLabel="옷 종류"
                  value={form.category}
                  options={categoryLabels.map((categoryLabel) => ({
                    value: categoryLabel,
                    label: categoryLabel,
                  }))}
                  onChange={(nextCategory) => onUpdateForm('category', nextCategory)}
                />
              </Field>

              <Field>
                <Label htmlFor="item-image-url">이미지 URL</Label>
                <TextInput
                  id="item-image-url"
                  value={form.imageUrl}
                  onChange={(event) => onUpdateForm('imageUrl', event.target.value)}
                  placeholder="https://..."
                />
              </Field>

              <Field>
                <Label as="span">시즌</Label>
                <OptionGrid>
                  {seasonOptions.map((season) => (
                    <OptionButton
                      key={season}
                      type="button"
                      $active={form.seasons.includes(season)}
                      onClick={() => onToggleSeason(season)}
                    >
                      {season}
                    </OptionButton>
                  ))}
                </OptionGrid>
              </Field>

              <Field>
                <Label as="span">색상</Label>
                <ColorSelectBox>
                  <ColorSelectButton
                    type="button"
                    aria-expanded={isColorSelectOpen}
                    onClick={() =>
                      setIsColorSelectOpen((currentValue) => !currentValue)
                    }
                  >
                    <ColorSelectText>{selectedColorText}</ColorSelectText>
                    <ColorSelectChevron
                      aria-hidden="true"
                      $open={isColorSelectOpen}
                    />
                  </ColorSelectButton>
                  {isColorSelectOpen && (
                    <ColorOptionList>
                      {colorOptions.map((colorOption) => (
                        <ColorOptionItem
                          key={colorOption}
                          type="button"
                          $active={form.colorNames.includes(colorOption)}
                          onClick={() => onToggleColor(colorOption)}
                        >
                          <ColorCheck aria-hidden="true">
                            {form.colorNames.includes(colorOption) ? '✓' : ''}
                          </ColorCheck>
                          {colorOption}
                        </ColorOptionItem>
                      ))}
                    </ColorOptionList>
                  )}
                </ColorSelectBox>
                {form.colorNames.length > 0 && (
                  <SelectedColorRow aria-label="선택한 색상">
                    {form.colorNames.map((colorName) => (
                      <SelectedColorTag key={colorName}>
                        #{colorName}
                      </SelectedColorTag>
                    ))}
                  </SelectedColorRow>
                )}
              </Field>

              {form.colorNames.includes('기타') && (
                <Field>
                  <Label htmlFor="item-custom-color">색상 직접 입력</Label>
                  <TextInput
                    id="item-custom-color"
                    value={form.customColorName}
                    onChange={(event) =>
                      onUpdateForm('customColorName', event.target.value)
                    }
                    placeholder="예: 라벤더"
                  />
                </Field>
              )}

              <TwoColumn>
                <Field>
                  <Label as="span">기장</Label>
                  <CustomSelect
                    ariaLabel="기장"
                    value={form.length}
                    placement="up"
                    options={lengthOptions.map((length) => ({
                      value: length,
                      label: length,
                    }))}
                    onChange={(nextLength) => onUpdateForm('length', nextLength)}
                  />
                </Field>

                <Field>
                  <Label as="span">소재</Label>
                  <CustomSelect
                    ariaLabel="소재"
                    value={form.material}
                    placement="up"
                    options={materialOptions.map((material) => ({
                      value: material,
                      label: material,
                    }))}
                    onChange={(nextMaterial) =>
                      onUpdateForm('material', nextMaterial)
                    }
                  />
                </Field>
              </TwoColumn>

              {error && <ErrorText role="alert">{error}</ErrorText>}

              <ActionRow>
                <CancelButton type="button" onClick={handleCloseModal}>
                  취소
                </CancelButton>
                <SaveButton type="submit">저장</SaveButton>
              </ActionRow>
            </Form>
          </ModalPanel>
        </ModalOverlay>
      )}
    </Page>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 21C10.7 19.8 9.4 18.8 8.2 17.8C4.6 14.8 2 12.6 2 8.9C2 6.1 4.2 4 7 4C8.6 4 10.2 4.8 11.1 6.1H12.9C13.8 4.8 15.4 4 17 4C19.8 4 22 6.1 22 8.9C22 12.6 19.4 14.8 15.8 17.8C14.6 18.8 13.3 19.8 12 21Z"
        fill="currentColor"
      />
    </svg>
  );
}

const HomePage = styled.section`
  min-height: calc(100% + 44px);
  display: grid;
  align-content: start;
  justify-items: stretch;
  gap: 18px;
  margin: -20px -20px -24px;
  padding: 22px 20px 30px;
  background: ${({ $background }) => $background};
  --season-primary: ${({ $primary }) => $primary};
`;

const WardrobeCard = styled.section`
  min-height: calc(100dvh - 182px);
  display: grid;
  gap: 19px;
  padding: 0;
  border-radius: 10px;
  background: transparent;
  box-shadow: none;
`;

const WardrobeCanvas = styled.div`
  position: relative;
  width: min(354px, 100%);
  aspect-ratio: 1062 / 2049;
  justify-self: center;
  overflow: hidden;
  border-radius: 10px;
  background: transparent;
  box-shadow: 2px 2px 10px color-mix(in srgb, var(--season-primary) 20%, transparent);
`;

const WardrobeImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
`;

const wardrobeHotspotStyles = {
  outer: 'left: 9%; top: 8%; width: 43.5%; height: 22.5%;',
  top: 'left: 9%; top: 31.5%; width: 43.5%; height: 21%;',
  bottom: 'left: 9%; top: 53.5%; width: 43.5%; height: 38%;',
  dress: 'left: 53.2%; top: 24%; width: 37.4%; height: 48.4%;',
  accessory: 'left: 53.2%; top: 8%; width: 37.4%; height: 12.5%;',
  bag: 'left: 53.2%; top: 20.6%; width: 37.4%; height: 12.5%;',
  shoes: 'left: 53.2%; top: 80%; width: 37.4%; height: 11%;',
};

const WardrobeHotspot = styled.button`
  position: absolute;
  ${({ $area }) => wardrobeHotspotStyles[$area] ?? ''}
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  z-index: 1;

  &:focus-visible {
    outline: 3px solid var(--season-primary);
    outline-offset: 2px;
  }

`;

const Page = styled.section`
  min-height: calc(100% + 44px);
  position: relative;
  display: grid;
  align-content: start;
  gap: 20px;
  margin: -20px -20px -24px;
  padding: 28px 20px 32px;
  background: ${({ $background }) => $background};
  --season-primary: ${({ $primary }) => $primary};
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const CategoryTitle = styled.h2`
  margin: 0 0 4px 22px;
  color: #43474F;
  font-family: 'KyoboHandwriting2025lyb', sans-serif;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0;
`;

const ClosetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 10px;
`;

const ClosetCard = styled.article`
  position: relative;
  min-width: 0;
  aspect-ratio: 1 / 1.28;
  overflow: hidden;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 22px color-mix(in srgb, var(--season-primary) 18%, transparent);
`;

const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #ffffff;
`;

const LikeButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  background: transparent;
  color: ${({ $active }) => ($active ? 'var(--season-primary)' : '#c7c7c7')};
  font-size: 0;
  line-height: 1;

  svg {
    width: 18px;
    height: 18px;
    display: block;
  }
`;

const ColorDotRow = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
  max-width: calc(100% - 20px);
`;

const ColorDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: ${({ $isLight }) =>
    $isLight ? '0.3px solid var(--season-primary)' : '0'};
  background: ${({ $color }) => $color};
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.08);
`;

const EmptyState = styled.div`
  display: grid;
  align-content: center;
  gap: 10px;
  justify-items: center;
  min-height: 260px;
  margin-top: 8px;
  text-align: center;
`;

const EmptyTitle = styled.h3`
  margin: 0;
  color: ${({ $textColor }) => $textColor};
  font-size: 18px;
  font-weight: 500;
`;

const EmptyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 1.45;
`;

const FloatingAddButton = styled.button`
  position: fixed;
  right: max(22px, calc((100vw - 390px) / 2 + 22px));
  bottom: calc(
    ${({ theme }) => theme.heights.bottomNav} + env(safe-area-inset-bottom) + 10px
  );
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  z-index: 5;
  border-radius: 50%;
  background: var(--season-primary);
  box-shadow: 0 12px 24px color-mix(in srgb, var(--season-primary) 32%, transparent);

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 36px;
    height: 6px;
    border-radius: 999px;
    background: #ffffff;
  }

  &::after {
    transform: rotate(90deg);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 20;
  padding: 20px;
  background: rgba(17, 24, 39, 0.45);
`;

const ModalPanel = styled.section`
  width: min(350px, 100%);
  max-height: min(760px, calc(100dvh - 40px));
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(17, 24, 39, 0.24);
`;

const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 18px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 20px;
`;

const CloseButton = styled.button`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f2f4f7;
  color: #4b5563;
  font-size: 24px;
  line-height: 1;
`;

const Form = styled.form`
  min-height: 0;
  display: grid;
  gap: 14px;
  padding: 16px 18px 18px;
  overflow-y: auto;
`;

const Field = styled.div`
  display: grid;
  gap: 7px;
`;

const Label = styled.label`
  color: #374151;
  font-size: 13px;
  font-weight: 700;
`;

const TextInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
  font-size: 14px;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

const OptionButton = styled.button`
  min-width: 0;
  height: 36px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? 'var(--season-primary)' : theme.colors.border};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? 'var(--season-primary)' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#4b5563')};
  font-size: 13px;
  font-weight: 700;
`;

const ColorSelectBox = styled.div`
  position: relative;
`;

const ColorSelectButton = styled.button`
  position: relative;
  width: 100%;
  min-width: 0;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
  font-family: 'KyoboHandwriting2025lyb', sans-serif;
  font-size: 14px;
  text-align: left;
`;

const ColorSelectText = styled.span`
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
`;

const ColorSelectChevron = styled.span`
  flex: 0 0 auto;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #6b7280;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 140ms ease;
`;

const ColorOptionList = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(100% + 6px);
  z-index: 30;
  max-height: 188px;
  display: grid;
  gap: 4px;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: #ffffff;
  overflow-y: auto;
  box-shadow: 0 14px 32px rgba(17, 24, 39, 0.16);
`;

const ColorOptionItem = styled.button`
  min-width: 0;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border: 1px solid
    ${({ $active }) => ($active ? 'var(--season-primary)' : 'transparent')};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? '#f0f1ff' : '#ffffff')};
  color: ${({ $active }) => ($active ? 'var(--season-primary)' : '#4b5563')};
  font-family: 'KyoboHandwriting2025lyb', sans-serif;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
`;

const ColorCheck = styled.span`
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: #ffffff;
  color: var(--season-primary);
  font-size: 12px;
  font-weight: 800;
`;

const CustomSelectBox = styled(ColorSelectBox)`
  width: ${({ $width }) => $width};
`;

const CustomSelectButton = ColorSelectButton;
const CustomSelectText = ColorSelectText;
const CustomSelectChevron = ColorSelectChevron;

const CustomOptionList = styled(ColorOptionList)`
  top: ${({ $placement }) =>
    $placement === 'down' ? 'calc(100% + 6px)' : 'auto'};
  bottom: ${({ $placement }) =>
    $placement === 'up' ? 'calc(100% + 6px)' : 'auto'};
`;

const CustomOptionItem = styled(ColorOptionItem)`
  justify-content: flex-start;
  padding: 0 12px;
`;

const SelectedColorRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SelectedColorTag = styled.span`
  padding: 4px 8px;
  border-radius: 999px;
  background: #f2f4f7;
  color: var(--season-primary);
  font-size: 11px;
  font-weight: 700;
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const ErrorText = styled.p`
  margin: 0;
  color: #e11d48;
  font-size: 13px;
  text-align: center;
`;

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const CancelButton = styled.button`
  height: 44px;
  border-radius: 8px;
  background: #f2f4f7;
  color: #4b5563;
  font-size: 15px;
  font-weight: 700;
`;

const SaveButton = styled.button`
  height: 44px;
  border-radius: 8px;
  background: var(--season-primary);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
`;

export default ClosetPage;
