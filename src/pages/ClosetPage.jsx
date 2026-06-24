import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useSeasonTheme } from '@/store/seasonThemeStore';
import { useClothesStore } from '@/store/clothesStore';
import closetArtwork from '@/assets/CLOSET.png';
import {
  previewClothesImport,
  importClothes,
  updateClothesFavorite,
} from '@/api/clothes';

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

const detailSelectLabels = {
  선택안함: '선택 안 함',
  민소매: '민소매',
  반소매: '반소매',
  칠부: '칠부',
  긴소매: '긴소매',
  얇음: '얇음',
  보통: '보통',
  두꺼움: '두꺼움',
  슬림: '슬림',
  레귤러: '레귤러',
  루즈: '루즈',
  오버핏: '오버핏',
};

const categoryByKey = Object.fromEntries(
  closetCategories.map((category) => [category.key, category]),
);
const allCategory = { key: 'all', label: '전체' };

const colorMap = {
  WHITE: '#F8FAFC',
  BLACK: '#111827',
  GRAY: '#9CA3AF',
  BEIGE: '#EAD7B7',
  BROWN: '#8B5E3C',
  NAVY: '#31326F',
  BLUE: '#3B82F6',
  GREEN: '#22C55E',
  YELLOW: '#FACC15',
  ORANGE: '#F97316',
  RED: '#EF4444',
  PINK: '#F9A8D4',
  PURPLE: '#8B5CF6',
  SILVER: '#D8DEE9',
  GOLD: '#D4AF37',
  MULTI: '#7DD3FC',
  OTHER: '#D8DEE9',
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

const sleeveLengthOptions = [
  { value: '', label: '선택안함' },
  { value: 'SLEEVELESS', label: '민소매' },
  { value: 'SHORT', label: '반소매' },
  { value: 'THREE_QUARTER', label: '칠부' },
  { value: 'LONG', label: '긴소매' },
];

const thicknessOptions = [
  { value: '', label: '선택안함' },
  { value: 'THIN', label: '얇음' },
  { value: 'NORMAL', label: '보통' },
  { value: 'THICK', label: '두꺼움' },
];

const fitOptions = [
  { value: '', label: '선택안함' },
  { value: 'SLIM', label: '슬림' },
  { value: 'REGULAR', label: '레귤러' },
  { value: 'LOOSE', label: '루즈' },
  { value: 'OVERSIZED', label: '오버핏' },
];

const materialOptions = [
  { value: '', label: '선택안함' },
  { value: 'COTTON', label: '면' },
  { value: 'POLYESTER', label: '폴리에스터' },
  { value: 'NYLON', label: '나일론' },
  { value: 'WOOL', label: '울' },
  { value: 'CASHMERE', label: '캐시미어' },
  { value: 'LINEN', label: '린넨' },
  { value: 'DENIM', label: '데님' },
  { value: 'LEATHER', label: '가죽' },
  { value: 'SUEDE', label: '스웨이드' },
  { value: 'DOWN', label: '다운' },
  { value: 'FLEECE', label: '플리스' },
  { value: 'SYNTHETIC', label: '합성섬유' },
  { value: 'MIXED', label: '혼방' },
  { value: 'OTHER', label: '기타' },
];

const colorOptions = [
  { value: '', label: '선택안함' },
  { value: 'BLACK', label: '블랙' },
  { value: 'WHITE', label: '화이트' },
  { value: 'GRAY', label: '그레이' },
  { value: 'BEIGE', label: '베이지' },
  { value: 'BROWN', label: '브라운' },
  { value: 'NAVY', label: '네이비' },
  { value: 'BLUE', label: '블루' },
  { value: 'GREEN', label: '그린' },
  { value: 'YELLOW', label: '옐로우' },
  { value: 'ORANGE', label: '오렌지' },
  { value: 'RED', label: '레드' },
  { value: 'PINK', label: '핑크' },
  { value: 'PURPLE', label: '퍼플' },
  { value: 'SILVER', label: '실버' },
  { value: 'GOLD', label: '골드' },
  { value: 'MULTI', label: '멀티' },
  { value: 'OTHER', label: '기타' },
];

const shoeTypeOptions = [
  { value: '', label: '선택안함' },
  { value: 'SNEAKERS', label: '스니커즈' },
  { value: 'BOOTS', label: '부츠' },
  { value: 'LOAFERS', label: '로퍼' },
  { value: 'DRESS_SHOES', label: '구두' },
  { value: 'SANDALS', label: '샌들' },
  { value: 'SLIPPERS', label: '슬리퍼' },
  { value: 'OTHER', label: '기타' },
];

const accTypeOptions = [
  { value: '', label: '선택안함' },
  { value: 'HAT', label: '모자' },
  { value: 'CAP', label: '캡' },
  { value: 'BEANIE', label: '비니' },
  { value: 'SCARF', label: '스카프' },
  { value: 'GLOVES', label: '장갑' },
  { value: 'BELT', label: '벨트' },
  { value: 'JEWELRY', label: '주얼리' },
  { value: 'OTHER', label: '기타' },
];

const bagTypeOptions = [
  { value: '', label: '선택안함' },
  { value: 'BACKPACK', label: '백팩' },
  { value: 'TOTE', label: '토트백' },
  { value: 'SHOULDER', label: '숄더백' },
  { value: 'CROSSBODY', label: '크로스백' },
  { value: 'CLUTCH', label: '클러치' },
  { value: 'DUFFEL', label: '더플백' },
  { value: 'OTHER', label: '기타' },
];

const sleeveLengthValues = new Set(
  sleeveLengthOptions.map(({ value }) => value),
);
const thicknessValues = new Set(thicknessOptions.map(({ value }) => value));
const fitValues = new Set(fitOptions.map(({ value }) => value));
const materialValues = new Set(materialOptions.map(({ value }) => value));
const colorValues = new Set(colorOptions.map(({ value }) => value));
const typeValuesByCategory = {
  SHOES: new Set(shoeTypeOptions.map(({ value }) => value)),
  ACC: new Set(accTypeOptions.map(({ value }) => value)),
  BAG: new Set(bagTypeOptions.map(({ value }) => value)),
};
const typeValues = new Set(
  [...shoeTypeOptions, ...accTypeOptions, ...bagTypeOptions].map(
    ({ value }) => value,
  ),
);

const detailOptionAliases = {
  롱: 'LONG',
  긴소매: 'LONG',
  숏: 'SHORT',
  반소매: 'SHORT',
  민소매: 'SLEEVELESS',
  칠부: 'THREE_QUARTER',
  두꺼움: 'THICK',
  보통: 'NORMAL',
  얇음: 'THIN',
  슬림: 'SLIM',
  스탠다드: 'REGULAR',
  레귤러: 'REGULAR',
  루즈: 'LOOSE',
  오버: 'OVERSIZED',
  오버핏: 'OVERSIZED',
  면: 'COTTON',
  코튼: 'COTTON',
  폴리에스터: 'POLYESTER',
  나일론: 'NYLON',
  울: 'WOOL',
  캐시미어: 'CASHMERE',
  린넨: 'LINEN',
  데님: 'DENIM',
  가죽: 'LEATHER',
  스웨이드: 'SUEDE',
  다운: 'DOWN',
  플리스: 'FLEECE',
  합성섬유: 'SYNTHETIC',
  혼방: 'MIXED',
  기타: 'OTHER',
  블랙: 'BLACK',
  화이트: 'WHITE',
  그레이: 'GRAY',
  베이지: 'BEIGE',
  브라운: 'BROWN',
  네이비: 'NAVY',
  블루: 'BLUE',
  그린: 'GREEN',
  옐로우: 'YELLOW',
  노랑: 'YELLOW',
  오렌지: 'ORANGE',
  레드: 'RED',
  핑크: 'PINK',
  퍼플: 'PURPLE',
  실버: 'SILVER',
  골드: 'GOLD',
  멀티: 'MULTI',
  스니커즈: 'SNEAKERS',
  운동화: 'SNEAKERS',
  부츠: 'BOOTS',
  로퍼: 'LOAFERS',
  구두: 'DRESS_SHOES',
  샌들: 'SANDALS',
  슬리퍼: 'SLIPPERS',
  모자: 'HAT',
  캡: 'CAP',
  비니: 'BEANIE',
  스카프: 'SCARF',
  장갑: 'GLOVES',
  벨트: 'BELT',
  주얼리: 'JEWELRY',
  백팩: 'BACKPACK',
  토트백: 'TOTE',
  숄더백: 'SHOULDER',
  크로스백: 'CROSSBODY',
  클러치: 'CLUTCH',
  더플백: 'DUFFEL',
};

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

const importDetailDefaults = {
  sleeveLength: '',
  thickness: '',
  fit: '',
  material: '',
  color: '',
  length: null,
  type: null,
  windproof: null,
  waterproof: null,
  warmthBonus: null,
};
const defaultRecommendedTempRange = {
  minTemp: 0,
  maxTemp: 0,
};

const fallbackColor = '#D8DEE9';
const defaultClothingImage = encodeURI(
  '/ChatGPT Image 2026년 6월 23일 오후 03_34_52.png',
);
const lightColorValues = new Set(['#ffffff', '#fff', '#f8fafc', '#f4f5f7']);
const isLightColor = (color) => lightColorValues.has(color.toLowerCase());
const toFiniteNumber = (value, fallback = 0) => {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const toRecommendedTempNumber = (value) => {
  if (String(value ?? '').trim() === '') return null;

  return toFiniteNumber(value, null);
};

const getPreviewTempRange = (preview) => {
  const minTemp = toRecommendedTempNumber(
    preview?.minTemp ?? preview?.min_temp,
  );
  const maxTemp = toRecommendedTempNumber(
    preview?.maxTemp ?? preview?.max_temp,
  );

  if (minTemp === null || maxTemp === null) return null;

  return { minTemp, maxTemp };
};

const toNullableText = (value) => {
  const textValue = String(value ?? '').trim();

  return textValue || null;
};

const toOptionValue = (value, validValues) => {
  const textValue = String(value ?? '').trim();
  const upperValue = textValue.toUpperCase();
  const normalizedValue = detailOptionAliases[textValue] ?? upperValue;

  return validValues.has(normalizedValue) ? normalizedValue : '';
};

const getTypeOptionsForCategory = (category) => {
  if (category === 'SHOES') return shoeTypeOptions;
  if (category === 'ACC') return accTypeOptions;
  if (category === 'BAG') return bagTypeOptions;

  return [];
};

const getTypeValuesForCategory = (category) =>
  typeValuesByCategory[category] ?? new Set(['']);

const normalizeImportDetails = (details = {}) => ({
  sleeveLength: toOptionValue(details.sleeveLength, sleeveLengthValues),
  thickness: toOptionValue(details.thickness, thicknessValues),
  fit: toOptionValue(details.fit, fitValues),
  material: toOptionValue(details.material, materialValues),
  color: toOptionValue(details.color, colorValues),
  length: null,
  type: toOptionValue(details.type, typeValues),
  windproof: null,
  waterproof: null,
  warmthBonus: null,
});

const createImportDetailsPayload = (details = {}, category) => ({
  sleeveLength: toNullableText(details.sleeveLength),
  thickness: toNullableText(details.thickness),
  fit: toNullableText(details.fit),
  material: toNullableText(details.material),
  color: toNullableText(details.color),
  length: null,
  type: toNullableText(
    toOptionValue(details.type, getTypeValuesForCategory(category)),
  ),
  windproof: null,
  waterproof: null,
  warmthBonus: null,
});

const getItemColors = (item) => {
  const colors = Array.isArray(item?.colors) ? item.colors : [];
  const nextColors =
    colors.length > 0 ? colors : [item?.color ?? fallbackColor];

  return nextColors.filter(Boolean);
};

function ClosetPage() {
  const navigate = useNavigate();
  const { category } = useParams();
  const { seasonTheme } = useSeasonTheme();
  const selectedCategory =
    category === allCategory.key
      ? allCategory
      : category
        ? categoryByKey[category]
        : null;
  const items = useClothesStore((state) => state.items);
  const clothesLoading = useClothesStore((state) => state.loading);
  const likedItemIds = useClothesStore((state) => state.likedItemIds);
  const favoritePendingItemIds = useClothesStore(
    (state) => state.favoritePendingItemIds,
  );
  const closetError = useClothesStore((state) => state.error);
  const loadClothes = useClothesStore((state) => state.loadClothes);
  const appendImportedClothes = useClothesStore(
    (state) => state.appendImportedClothes,
  );
  const setClosetError = (nextError) => {
    useClothesStore.setState((state) => ({
      error:
        typeof nextError === 'function' ? nextError(state.error) : nextError,
    }));
  };
  const setFavoritePendingItemIds = (nextPendingItemIds) => {
    useClothesStore.setState((state) => ({
      favoritePendingItemIds:
        typeof nextPendingItemIds === 'function'
          ? nextPendingItemIds(state.favoritePendingItemIds)
          : nextPendingItemIds,
    }));
  };
  const setLikedItemIds = (nextLikedItemIds) => {
    useClothesStore.setState((state) => ({
      likedItemIds:
        typeof nextLikedItemIds === 'function'
          ? nextLikedItemIds(state.likedItemIds)
          : nextLikedItemIds,
    }));
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importCategory, setImportCategory] = useState('OUTER');
  const [importPreview, setImportPreview] = useState(null);
  const [importConfirmName, setImportConfirmName] = useState('');
  const [importConfirmCategory, setImportConfirmCategory] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importSubmitting, setImportSubmitting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importDetails, setImportDetails] = useState(importDetailDefaults);
  const [acceptCategoryMismatch, setAcceptCategoryMismatch] = useState(false);
  const [recommendedTempRange, setRecommendedTempRange] = useState(
    defaultRecommendedTempRange,
  );
  const [isManualTempRange, setIsManualTempRange] = useState(false);

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
    setImportDetails(importDetailDefaults);
    setAcceptCategoryMismatch(false);
    setRecommendedTempRange(defaultRecommendedTempRange);
    setIsManualTempRange(false);
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

  useEffect(() => {
    loadClothes((cloth) => ({
      id: cloth.clothesId,
      name: cloth.name,
      category: categoryApiToDisplay[cloth.category] ?? cloth.category,
      imageUrl: cloth.imageUrl ?? '',
      color: fallbackColor,
    }));
  }, [loadClothes]);

  if (category && !selectedCategory) {
    return <Navigate to="/closet" replace />;
  }

  const openModal = () => {
    const routeApiCategory =
      selectedCategory && selectedCategory.key !== allCategory.key
        ? (categoryToApiEnum[selectedCategory.key] ?? 'OUTER')
        : 'OUTER';

    setImportCategory(routeApiCategory);
    setImportConfirmCategory(routeApiCategory);
    setAcceptCategoryMismatch(false);
    setImportError('');
    setRecommendedTempRange(defaultRecommendedTempRange);
    setIsManualTempRange(false);
    setIsModalOpen(true);
  };

  const toggleLikedItem = async (itemId) => {
    if (favoritePendingItemIds.includes(itemId)) return;

    const wasLiked = likedItemIds.includes(itemId);
    const nextFavorite = !wasLiked;

    setClosetError('');
    setFavoritePendingItemIds((currentPendingItemIds) => [
      ...currentPendingItemIds,
      itemId,
    ]);
    setLikedItemIds((currentLikedItemIds) =>
      nextFavorite
        ? [...currentLikedItemIds, itemId]
        : currentLikedItemIds.filter(
            (currentItemId) => currentItemId !== itemId,
          ),
    );

    try {
      await updateClothesFavorite(itemId, nextFavorite);
    } catch {
      setLikedItemIds((currentLikedItemIds) =>
        wasLiked
          ? [...new Set([...currentLikedItemIds, itemId])]
          : currentLikedItemIds.filter(
              (currentItemId) => currentItemId !== itemId,
            ),
      );
      setClosetError('좋아요 변경에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setFavoritePendingItemIds((currentPendingItemIds) =>
        currentPendingItemIds.filter(
          (currentItemId) => currentItemId !== itemId,
        ),
      );
    }
  };

  const handleFetchPreview = async () => {
    if (!importUrl.trim()) {
      setImportError('URL을 입력해 주세요.');
      return;
    }
    setImportLoading(true);
    setImportError('');
    setImportPreview(null);
    setAcceptCategoryMismatch(false);
    setRecommendedTempRange(defaultRecommendedTempRange);
    setIsManualTempRange(false);
    try {
      const previewCategory = importPreview
        ? importConfirmCategory
        : importCategory;
      const { data } = await previewClothesImport({
        category: previewCategory,
        originalUrl: importUrl.trim(),
      });
      const nextDetails = normalizeImportDetails(data.details);
      const previewTempRange = getPreviewTempRange(data);
      setImportPreview(data);
      setImportConfirmName(data.common?.name ?? '');
      setImportConfirmCategory(
        data.detectedCategory || data.requestedCategory || previewCategory,
      );
      setImportDetails(nextDetails);
      setRecommendedTempRange(previewTempRange ?? defaultRecommendedTempRange);
      setIsManualTempRange(!previewTempRange);
      setAcceptCategoryMismatch(false);
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
    setImportDetails(importDetailDefaults);
    setAcceptCategoryMismatch(false);
    setRecommendedTempRange(defaultRecommendedTempRange);
    setIsManualTempRange(false);
    setImportError('');
  };

  const handleImportDetailChange = (key, value) => {
    setImportDetails((currentDetails) => ({
      ...currentDetails,
      [key]: value,
    }));
  };

  const handleRecommendedTempRangeChange = (key, value) => {
    setRecommendedTempRange((currentRange) => ({
      ...currentRange,
      [key]: value,
    }));
  };

  const handleImportConfirmCategoryChange = (nextCategory) => {
    setImportConfirmCategory(nextCategory);
    setImportDetails((currentDetails) => ({
      ...currentDetails,
      type: '',
    }));
  };

  const handleImportSubmit = async () => {
    if (!importPreview) return;

    const trimmedName = importConfirmName.trim();

    if (!trimmedName) {
      setImportError('옷 이름을 입력해 주세요.');
      return;
    }

    const minTemp = toRecommendedTempNumber(recommendedTempRange.minTemp);
    const maxTemp = toRecommendedTempNumber(recommendedTempRange.maxTemp);

    if (minTemp === null || maxTemp === null) {
      setImportError('추천 온도 범위를 숫자로 입력해 주세요.');
      return;
    }

    if (importPreview.categoryMismatch && !acceptCategoryMismatch) {
      setImportError('감지된 카테고리와 다르게 등록하려면 동의가 필요합니다.');
      return;
    }

    setImportSubmitting(true);
    setImportError('');
    try {
      const normalizedDetails = normalizeImportDetails(importDetails);
      const detailsPayload = createImportDetailsPayload(
        normalizedDetails,
        importConfirmCategory,
      );
      const { data: importedClothes } = await importClothes({
        analysisToken: importPreview.analysisToken,
        name: trimmedName,
        category: importConfirmCategory,
        minTemp,
        maxTemp,
        details: detailsPayload,
        acceptCategoryMismatch: Boolean(
          importPreview.categoryMismatch && acceptCategoryMismatch,
        ),
      });

      const importedCategory =
        importedClothes?.category ?? importConfirmCategory;
      const displayCategory =
        categoryApiToDisplay[importedCategory] ?? importedCategory;
      const colorName = detailsPayload.color || '기타';
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
        length: detailsPayload.length,
        material: detailsPayload.material,
        weather: `${minTemp}°~${maxTemp}°`,
      };
      appendImportedClothes(newItem);
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
      clothesLoading={clothesLoading}
      likedItemIds={likedItemIds}
      favoritePendingItemIds={favoritePendingItemIds}
      closetError={closetError}
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
      importDetails={importDetails}
      acceptCategoryMismatch={acceptCategoryMismatch}
      recommendedTempRange={recommendedTempRange}
      isManualTempRange={isManualTempRange}
      onImportUrlChange={handleImportUrlChange}
      onImportCategoryChange={setImportCategory}
      onImportConfirmNameChange={setImportConfirmName}
      onImportConfirmCategoryChange={handleImportConfirmCategoryChange}
      onImportDetailChange={handleImportDetailChange}
      onRecommendedTempRangeChange={handleRecommendedTempRangeChange}
      onAcceptCategoryMismatchChange={setAcceptCategoryMismatch}
      onFetchPreview={handleFetchPreview}
      onImportSubmit={handleImportSubmit}
    />
  );
}

function ClosetHomeView({ seasonTheme, onSelect }) {
  return (
    <HomePage
      $background={seasonTheme.background}
      $primary={seasonTheme.primary}
    >
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
    spacedCategoryLabels[selectedOption?.label] ??
    detailSelectLabels[selectedOption?.label] ??
    selectedOption?.label ??
    '';

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
  clothesLoading,
  likedItemIds,
  favoritePendingItemIds,
  closetError,
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
  importDetails,
  acceptCategoryMismatch,
  recommendedTempRange,
  isManualTempRange,
  onImportUrlChange,
  onImportCategoryChange,
  onImportConfirmNameChange,
  onImportConfirmCategoryChange,
  onImportDetailChange,
  onRecommendedTempRangeChange,
  onAcceptCategoryMismatchChange,
  onFetchPreview,
  onImportSubmit,
}) {
  const handleOpenModal = () => {
    onOpenModal();
  };

  const handleCloseModal = () => {
    onCloseModal();
  };

  const typeOptions = getTypeOptionsForCategory(importConfirmCategory);

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

      {clothesLoading ? (
        <EmptyState>
          <EmptyText>옷 목록을 불러오는 중...</EmptyText>
        </EmptyState>
      ) : items.length > 0 ? (
        <>
          {closetError && (
            <InlineErrorText role="alert">{closetError}</InlineErrorText>
          )}
          <ClosetGrid>
            {items.filter(Boolean).map((item) => {
              const itemColors = getItemColors(item);
              const isLiked = likedItemIds.includes(item.id);
              const isFavoritePending = favoritePendingItemIds.includes(
                item.id,
              );

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
                    disabled={isFavoritePending}
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
        </>
      ) : (
        <EmptyState>
          <EmptyTitle $textColor={seasonTheme.text}>
            아직 등록된 옷이 없어요.
          </EmptyTitle>
          <EmptyText>
            오른쪽 아래 + 버튼으로 새 옷을 추가할 수 있어요.
          </EmptyText>
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
                      onChange={(e) =>
                        onImportConfirmNameChange(e.target.value)
                      }
                    />
                  </Field>

                  <Field>
                    <Label as="span">등록 카테고리</Label>
                    <CustomSelect
                      ariaLabel="등록 카테고리"
                      value={importConfirmCategory}
                      options={importCategoryOptions}
                      onChange={onImportConfirmCategoryChange}
                    />
                  </Field>

                  {importPreview.categoryMismatch && (
                    <MismatchConsentBox>
                      <MismatchNotice>
                        감지된 카테고리와 등록 카테고리가 다릅니다.
                      </MismatchNotice>
                      <CheckboxLabel>
                        <CheckboxInput
                          type="checkbox"
                          checked={acceptCategoryMismatch}
                          onChange={(e) =>
                            onAcceptCategoryMismatchChange(e.target.checked)
                          }
                        />
                        이 카테고리로 등록할게요
                      </CheckboxLabel>
                    </MismatchConsentBox>
                  )}
                </>
              )}

              {importPreview &&
                (isManualTempRange ? (
                  <TemperatureRangeFields>
                <Field>
                  <Label htmlFor="import-min-temp">추천 최저 온도</Label>
                  <TextInput
                    id="import-min-temp"
                    type="number"
                    step="0.1"
                    value={recommendedTempRange.minTemp}
                    onChange={(e) =>
                      onRecommendedTempRangeChange('minTemp', e.target.value)
                    }
                  />
                </Field>
                <Field>
                  <Label htmlFor="import-max-temp">추천 최고 온도</Label>
                  <TextInput
                    id="import-max-temp"
                    type="number"
                    step="0.1"
                    value={recommendedTempRange.maxTemp}
                    onChange={(e) =>
                      onRecommendedTempRangeChange('maxTemp', e.target.value)
                    }
                  />
                </Field>
                  </TemperatureRangeFields>
                ) : (
                  <TemperatureRangePreview>
                    <span>추천 온도 범위</span>
                    <strong>
                      {recommendedTempRange.minTemp}°C ~{' '}
                      {recommendedTempRange.maxTemp}°C
                    </strong>
                  </TemperatureRangePreview>
                ))}

              {importPreview && (
                <ImportDetailFields>
                  <Field>
                    <Label as="span">소매 길이</Label>
                    <CustomSelect
                      ariaLabel="소매 길이"
                      value={importDetails.sleeveLength}
                      options={sleeveLengthOptions}
                      onChange={(value) =>
                        onImportDetailChange('sleeveLength', value)
                      }
                    />
                  </Field>
                  <Field>
                    <Label as="span">두께</Label>
                    <CustomSelect
                      ariaLabel="두께"
                      value={importDetails.thickness}
                      options={thicknessOptions}
                      onChange={(value) =>
                        onImportDetailChange('thickness', value)
                      }
                    />
                  </Field>
                  <Field>
                    <Label as="span">핏</Label>
                    <CustomSelect
                      ariaLabel="핏"
                      value={importDetails.fit}
                      options={fitOptions}
                      onChange={(value) => onImportDetailChange('fit', value)}
                    />
                  </Field>
                  <Field>
                    <Label as="span">소재</Label>
                    <CustomSelect
                      ariaLabel="소재"
                      value={importDetails.material}
                      options={materialOptions}
                      onChange={(value) =>
                        onImportDetailChange('material', value)
                      }
                    />
                  </Field>
                  <Field>
                    <Label as="span">색상</Label>
                    <CustomSelect
                      ariaLabel="색상"
                      value={importDetails.color}
                      options={colorOptions}
                      onChange={(value) => onImportDetailChange('color', value)}
                    />
                  </Field>
                  {typeOptions.length > 0 && (
                    <Field>
                      <Label as="span">종류</Label>
                      <CustomSelect
                        ariaLabel="종류"
                        value={importDetails.type}
                        options={typeOptions}
                        onChange={(value) =>
                          onImportDetailChange('type', value)
                        }
                      />
                    </Field>
                  )}
                </ImportDetailFields>
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

              {importError && (
                <ErrorText role="alert">
                  {importError}
                </ErrorText>
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
                    !importPreview ||
                    (importPreview.categoryMismatch && !acceptCategoryMismatch)
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
  height: calc(100% + 44px);
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  justify-items: stretch;
  gap: 18px;
  margin: -20px -20px -24px;
  padding: 22px 20px 30px;
  background: ${({ $background }) => $background};
  --season-primary: ${({ $primary }) => $primary};
  overflow: hidden;
`;

const WardrobeCard = styled.section`
  min-height: 0;
  height: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
  gap: 19px;
  padding: 0;
  border-radius: 10px;
  background: transparent;
  box-shadow: none;
`;

const WardrobeCanvas = styled.div`
  position: relative;
  width: min(354px, 100%);
  max-height: 100%;
  aspect-ratio: 1062 / 2049;
  justify-self: center;
  overflow: hidden;
  border-radius: 10px;
  background: transparent;
  box-shadow: 2px 2px 10px
    color-mix(in srgb, var(--season-primary) 20%, transparent);
`;

const WardrobeImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
`;

const wardrobeHotspotStyles = {
  outer: 'left: 9.2%; top: 7.8%; width: 40%; height: 22.4%;',
  top: 'left: 9.2%; top: 31%; width: 40%; height: 22.2%;',
  bottom: 'left: 9.2%; top: 54.1%; width: 40%; height: 42.5%;',
  accessory: 'left: 50.9%; top: 7.8%; width: 40%; height: 9.8%;',
  bag: 'left: 50.9%; top: 18.5%; width: 40%; height: 9.2%;',
  dress: 'left: 50.9%; top: 28.4%; width: 40%; height: 57.1%;',
  shoes: 'left: 50.9%; top: 86.3%; width: 40%; height: 10.4%;',
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
  padding: 28px 20px 108px;
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
  color: #43474f;
  font-family: 'KyoboHandwriting2025lyb', sans-serif;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0;
`;

const ClosetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: max-content;
  align-content: start;
  row-gap: 18px;
  column-gap: 10px;
`;

const ClosetCard = styled.article`
  position: relative;
  min-width: 0;
  aspect-ratio: 1 / 1.28;
  overflow: hidden;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 22px
    color-mix(in srgb, var(--season-primary) 18%, transparent);
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

  &:disabled {
    cursor: wait;
    opacity: 0.62;
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
  min-height: 0;
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
    ${({ theme }) => theme.heights.bottomNav} + env(safe-area-inset-bottom) +
      10px
  );
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  z-index: 5;
  border-radius: 50%;
  background: var(--season-primary);
  box-shadow: 0 12px 24px
    color-mix(in srgb, var(--season-primary) 32%, transparent);

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

const InlineErrorText = styled(ErrorText)`
  text-align: left;
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

const MismatchConsentBox = styled.div`
  display: grid;
  gap: 9px;
  padding: 11px 12px;
  border-radius: 8px;
  background: #fffbeb;
  color: #92400e;
`;

const MismatchNotice = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 700;
`;

const TemperatureRangeFields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
`;

const TemperatureRangePreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
  color: #374151;
  font-size: 13px;

  strong {
    color: var(--season-primary);
    font-size: 14px;
    font-weight: 800;
    white-space: nowrap;
  }
`;

const ImportDetailFields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #374151;
  font-size: 13px;
  font-weight: 700;
`;

const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--season-primary);
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
