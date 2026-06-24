import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useSeasonTheme } from '@/store/seasonThemeStore';
import closetArtwork from '@/assets/CLOSET.png';
import { previewClothesImport, importClothes } from '@/api/clothes';
import { getWeatherComparison } from '@/api/weather';

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

const importCategoryOptions = [
  { value: 'OUTER', label: '아우터' },
  { value: 'TOP', label: '상의' },
  { value: 'BOTTOM', label: '하의' },
  { value: 'ACC', label: '액세서리' },
  { value: 'BAG', label: '가방' },
  { value: 'SHOES', label: '신발' },
];

const categoryToApiEnum = {
  outer: 'OUTER',
  top: 'TOP',
  bottom: 'BOTTOM',
  accessory: 'ACC',
  bag: 'BAG',
  shoes: 'SHOES',
};

const categoryApiToDisplay = {
  OUTER: '아우터',
  TOP: '상의',
  BOTTOM: '하의',
  ACC: '액세서리',
  BAG: '가방',
  SHOES: '신발',
};

const importDetailLabels = {
  sleeveLength: '소매 길이',
  thickness: '두께',
  fit: '핏',
  material: '소재',
  color: '색상',
  length: '기장',
  type: '종류',
  windproof: '방풍',
  waterproof: '방수',
  warmthBonus: '보온 지수',
};

const importDetailDefaults = {
  sleeveLength: '',
  thickness: '',
  fit: '',
  material: '',
  color: '',
  length: '',
  type: '',
  windproof: false,
  waterproof: false,
  warmthBonus: 0,
};

const fallbackColor = '#D8DEE9';
const defaultClothingImage = encodeURI(
  '/ChatGPT Image 2026년 6월 23일 오후 03_34_52.png',
);
const lightColorValues = new Set(['#ffffff', '#fff', '#f8fafc', '#f4f5f7']);
const isLightColor = (color) => lightColorValues.has(color.toLowerCase());
const WEATHER_LOCATION_NAME = '대구광역시, 북구';

const toFiniteNumber = (value, fallback = 0) => {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const normalizeImportDetails = (details = {}) => ({
  sleeveLength: details.sleeveLength ?? importDetailDefaults.sleeveLength,
  thickness: details.thickness ?? importDetailDefaults.thickness,
  fit: details.fit ?? importDetailDefaults.fit,
  material: details.material ?? importDetailDefaults.material,
  color: details.color ?? importDetailDefaults.color,
  length: details.length ?? importDetailDefaults.length,
  type: details.type ?? importDetailDefaults.type,
  windproof: Boolean(details.windproof),
  waterproof: Boolean(details.waterproof),
  warmthBonus: toFiniteNumber(
    details.warmthBonus,
    importDetailDefaults.warmthBonus,
  ),
});

const getWeatherTemperatureRange = (weather) => {
  const minTemp = toFiniteNumber(weather?.temp_min ?? weather?.minTemp, null);
  const maxTemp = toFiniteNumber(weather?.temp_max ?? weather?.maxTemp, null);

  if (minTemp === null || maxTemp === null) return null;

  return { minTemp, maxTemp };
};

const getItemColors = (item) => {
  const colors = Array.isArray(item?.colors) ? item.colors : [];
  const nextColors = colors.length > 0 ? colors : [item?.color ?? fallbackColor];

  return nextColors.filter(Boolean);
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
  const [importUrl, setImportUrl] = useState('');
  const [importCategory, setImportCategory] = useState('OUTER');
  const [importPreview, setImportPreview] = useState(null);
  const [importConfirmName, setImportConfirmName] = useState('');
  const [importConfirmCategory, setImportConfirmCategory] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importSubmitting, setImportSubmitting] = useState(false);
  const [importError, setImportError] = useState('');
  const [todayWeatherRange, setTodayWeatherRange] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return [];
    if (selectedCategory.key === allCategory.key) return items;

    return items.filter((item) => item.category === selectedCategory.label);
  }, [items, selectedCategory]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setImportUrl('');
    setImportCategory('OUTER');
    setImportPreview(null);
    setImportConfirmName('');
    setImportConfirmCategory('');
    setImportLoading(false);
    setImportSubmitting(false);
    setImportError('');
    setTodayWeatherRange(null);
    setWeatherLoading(false);
    setWeatherError('');
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

  const loadTodayWeatherRange = async () => {
    setWeatherLoading(true);
    setWeatherError('');
    setTodayWeatherRange(null);

    try {
      const { data } = await getWeatherComparison(WEATHER_LOCATION_NAME);
      const comparisonData = data?.data ?? data;
      const nextWeatherRange = getWeatherTemperatureRange(comparisonData?.today);

      if (!nextWeatherRange) {
        throw new Error('Invalid weather range');
      }

      setTodayWeatherRange(nextWeatherRange);
    } catch {
      setWeatherError('오늘 최저/최고 온도를 불러오지 못했습니다.');
    } finally {
      setWeatherLoading(false);
    }
  };

  const openModal = () => {
    const routeApiCategory =
      selectedCategory && selectedCategory.key !== allCategory.key
        ? (categoryToApiEnum[selectedCategory.key] ?? 'OUTER')
        : 'OUTER';

    setImportCategory(routeApiCategory);
    setImportConfirmCategory(routeApiCategory);
    setImportError('');
    setIsModalOpen(true);
    loadTodayWeatherRange();
  };

  const toggleLikedItem = (itemId) => {
    setLikedItemIds((currentLikedItemIds) =>
      currentLikedItemIds.includes(itemId)
        ? currentLikedItemIds.filter((currentItemId) => currentItemId !== itemId)
        : [...currentLikedItemIds, itemId],
    );
  };

  const handleFetchPreview = async () => {
    if (!importUrl.trim()) {
      setImportError('URL을 입력해 주세요.');
      return;
    }
    setImportLoading(true);
    setImportError('');
    setImportPreview(null);
    try {
      const previewCategory = importPreview
        ? importConfirmCategory
        : importCategory;
      const { data } = await previewClothesImport({
        category: previewCategory,
        originalUrl: importUrl.trim(),
      });
      setImportPreview(data);
      setImportConfirmName(data.common?.name ?? '');
      setImportConfirmCategory(
        data.detectedCategory || data.requestedCategory || previewCategory,
      );
    } catch {
      setImportError('미리보기를 불러오지 못했습니다. URL을 확인해 주세요.');
    } finally {
      setImportLoading(false);
    }
  };

  const handleImportUrlChange = (nextImportUrl) => {
    setImportUrl(nextImportUrl);
    setImportPreview(null);
    setImportConfirmName('');
    setImportConfirmCategory(importCategory);
    setImportError('');
  };

  const handleImportSubmit = async () => {
    if (!importPreview) return;

    const trimmedName = importConfirmName.trim();

    if (!trimmedName) {
      setImportError('옷 이름을 입력해 주세요.');
      return;
    }

    if (!todayWeatherRange) {
      setImportError('오늘 최저/최고 온도를 불러온 뒤 등록해 주세요.');
      return;
    }

    setImportSubmitting(true);
    setImportError('');
    try {
      const normalizedDetails = normalizeImportDetails(importPreview.details);
      const { minTemp, maxTemp } = todayWeatherRange;
      const { data: importedClothes } = await importClothes({
        analysisToken: importPreview.analysisToken,
        name: trimmedName,
        category: importConfirmCategory,
        minTemp,
        maxTemp,
        details: normalizedDetails,
        acceptCategoryMismatch: Boolean(importPreview.categoryMismatch),
      });

      const importedCategory = importedClothes?.category ?? importConfirmCategory;
      const displayCategory =
        categoryApiToDisplay[importedCategory] ?? importedCategory;
      const colorName = normalizedDetails.color || '기타';
      const color = colorMap[colorName] ?? fallbackColor;
      const newItem = {
        id: importedClothes?.clothesId ?? Date.now(),
        name: trimmedName,
        category: displayCategory,
        seasons: ['사계절'],
        colors: [color],
        color,
        colorNames: [colorName],
        colorName,
        imageUrl:
          importedClothes?.imageUrl ??
          importPreview.common?.imagePreviewUrl ??
          '',
        length: normalizedDetails.length,
        material: normalizedDetails.material,
        weather: `${minTemp}°~${maxTemp}°`,
      };
      setItems((prev) => [newItem, ...prev]);
      closeModal();

      const nextKey = Object.keys(categoryToApiEnum).find(
        (k) => categoryToApiEnum[k] === importedCategory,
      );
      if (nextKey && category !== allCategory.key && nextKey !== category) {
        navigate(`/closet/${nextKey}`);
      }
    } catch {
      setImportError('등록에 실패했습니다. 다시 시도해 주세요.');
      setImportSubmitting(false);
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
      isModalOpen={isModalOpen}
      onChangeCategory={(categoryKey) => navigate(`/closet/${categoryKey}`)}
      onOpenModal={openModal}
      onCloseModal={closeModal}
      onToggleLikedItem={toggleLikedItem}
      importUrl={importUrl}
      importCategory={importCategory}
      importPreview={importPreview}
      importConfirmName={importConfirmName}
      importConfirmCategory={importConfirmCategory}
      importLoading={importLoading}
      importSubmitting={importSubmitting}
      importError={importError}
      todayWeatherRange={todayWeatherRange}
      weatherLoading={weatherLoading}
      weatherError={weatherError}
      onImportUrlChange={handleImportUrlChange}
      onImportCategoryChange={setImportCategory}
      onImportConfirmNameChange={setImportConfirmName}
      onImportConfirmCategoryChange={setImportConfirmCategory}
      onFetchPreview={handleFetchPreview}
      onImportSubmit={handleImportSubmit}
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
  isModalOpen,
  onChangeCategory,
  onOpenModal,
  onCloseModal,
  onToggleLikedItem,
  importUrl,
  importCategory,
  importPreview,
  importConfirmName,
  importConfirmCategory,
  importLoading,
  importSubmitting,
  importError,
  todayWeatherRange,
  weatherLoading,
  weatherError,
  onImportUrlChange,
  onImportCategoryChange,
  onImportConfirmNameChange,
  onImportConfirmCategoryChange,
  onFetchPreview,
  onImportSubmit,
}) {
  const handleOpenModal = () => {
    onOpenModal();
  };

  const handleCloseModal = () => {
    onCloseModal();
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
          {items.filter(Boolean).map((item) => {
            const itemColors = getItemColors(item);
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

            <ModalScrollContent>
              <Field>
                <Label as="span">카테고리</Label>
                <CustomSelect
                  ariaLabel="가져올 옷 종류"
                  value={importPreview ? importConfirmCategory : importCategory}
                  options={importCategoryOptions}
                  onChange={
                    importPreview
                      ? onImportConfirmCategoryChange
                      : onImportCategoryChange
                  }
                />
              </Field>

              <Field>
                <Label htmlFor="import-url">상품 URL</Label>
                <TextInput
                  id="import-url"
                  value={importUrl}
                  onChange={(e) => onImportUrlChange(e.target.value)}
                  placeholder="https://..."
                />
              </Field>

              <SaveButton
                type="button"
                onClick={onFetchPreview}
                disabled={importLoading || !importUrl.trim()}
              >
                {importLoading ? '불러오는 중...' : '미리보기 불러오기'}
              </SaveButton>

              {importPreview?.common?.imagePreviewUrl && (
                <ImportPreviewImage
                  src={importPreview.common.imagePreviewUrl}
                  alt="상품 미리보기"
                />
              )}

              {importPreview && (
                <>
                  <Field>
                    <Label htmlFor="import-confirm-name">이름</Label>
                    <TextInput
                      id="import-confirm-name"
                      value={importConfirmName}
                      onChange={(e) => onImportConfirmNameChange(e.target.value)}
                    />
                  </Field>

                  <Field>
                    <Label as="span">
                      등록 카테고리
                      {importPreview.categoryMismatch && (
                        <CategoryMismatchTag>
                          감지 카테고리 불일치
                        </CategoryMismatchTag>
                      )}
                    </Label>
                    <CustomSelect
                      ariaLabel="등록 카테고리"
                      value={importConfirmCategory}
                      options={importCategoryOptions}
                      onChange={onImportConfirmCategoryChange}
                    />
                  </Field>
                </>
              )}

              <PreviewInfoRow>
                <span>오늘 온도 범위</span>
                <span>
                  {weatherLoading
                    ? '불러오는 중...'
                    : todayWeatherRange
                      ? `${todayWeatherRange.minTemp}°C ~ ${todayWeatherRange.maxTemp}°C`
                      : '정보 없음'}
                </span>
              </PreviewInfoRow>

              {importPreview?.details && (
                <ImportDetailList>
                  {Object.entries(importPreview.details)
                    .filter(
                      ([, v]) => v !== null && v !== '' && v !== false && v !== 0,
                    )
                    .map(([key, value]) => (
                      <ImportDetailRow key={key}>
                        <ImportDetailKey>
                          {importDetailLabels[key] ?? key}
                        </ImportDetailKey>
                        <ImportDetailValue>
                          {typeof value === 'boolean'
                            ? value
                              ? '있음'
                              : '없음'
                            : String(value)}
                        </ImportDetailValue>
                      </ImportDetailRow>
                    ))}
                </ImportDetailList>
              )}

              {importPreview?.existingProduct && (
                <ExistingProductNotice>
                  이미 등록된 상품입니다.
                </ExistingProductNotice>
              )}

              {importPreview?.warnings?.length > 0 && (
                <ImportWarnings>
                  {importPreview.warnings.map((w, i) => (
                    <ImportWarningItem key={i}>{w}</ImportWarningItem>
                  ))}
                </ImportWarnings>
              )}

              {(weatherError || importError) && (
                <ErrorText role="alert">{weatherError || importError}</ErrorText>
              )}

              <ActionRow>
                <CancelButton type="button" onClick={handleCloseModal}>
                  취소
                </CancelButton>
                <SaveButton
                  type="button"
                  onClick={onImportSubmit}
                  disabled={
                    importSubmitting ||
                    weatherLoading ||
                    !todayWeatherRange ||
                    !importPreview
                  }
                >
                  {importSubmitting ? '등록 중...' : '등록하기'}
                </SaveButton>
              </ActionRow>
            </ModalScrollContent>
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
  right: 22px;
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

const ModalScrollContent = styled.div`
  min-height: 0;
  display: grid;
  gap: 14px;
  padding: 16px 18px 18px;
  overflow-y: auto;
`;

const ImportPreviewImage = styled.img`
  width: 100%;
  max-height: 180px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #f9fafb;
`;

const CategoryMismatchTag = styled.span`
  margin-left: 8px;
  padding: 2px 7px;
  border-radius: 999px;
  background: #fef3c7;
  color: #92400e;
  font-size: 11px;
  font-weight: 700;
`;

const PreviewInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f9fafb;
  color: #374151;
  font-size: 13px;

  span:last-child {
    font-weight: 700;
    color: var(--season-primary);
  }
`;

const ImportDetailList = styled.dl`
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
`;

const ImportDetailRow = styled.div`
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
`;

const ImportDetailKey = styled.dt`
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
`;

const ImportDetailValue = styled.dd`
  margin: 0;
  color: #111827;
  font-size: 12px;
  font-weight: 700;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

const ExistingProductNotice = styled.p`
  margin: 0;
  padding: 10px 14px;
  border-radius: 8px;
  background: #eff6ff;
  color: #1e40af;
  font-size: 13px;
  font-weight: 700;
`;

const ImportWarnings = styled.ul`
  margin: 0;
  padding: 10px 14px;
  border-radius: 8px;
  background: #fffbeb;
  list-style: none;
  display: grid;
  gap: 4px;
`;

const ImportWarningItem = styled.li`
  color: #92400e;
  font-size: 12px;

  &::before {
    content: '⚠ ';
  }
`;

export default ClosetPage;
