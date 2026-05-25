import styled from 'styled-components';

const weatherIconMap = {
  cloudy: {
    label: '흐림',
    icon: 'https://api.iconify.design/fluent/weather-fog-20-filled.svg',
  },
  sunny: {
    label: '맑음',
    icon: 'https://api.iconify.design/ion/sunny.svg',
  },
  rainy: {
    label: '비',
    icon: 'https://api.iconify.design/bi/cloud-rain-fill.svg',
  },
};

function WeatherInfoCard({ location, temperature, color, weather = 'cloudy' }) {
  const weatherIcon = weatherIconMap[weather] ?? weatherIconMap.cloudy;

  return (
    <Card $color={color}>
      <Location $color={color}>
        <Pin aria-hidden="true" $color={color} />
        {location}
      </Location>
      <WeatherRow>
        <Temperature $color={color}>{temperature}°C</Temperature>
        <WeatherIcon
          aria-label={weatherIcon.label}
          $color={color}
          $icon={weatherIcon.icon}
        />
      </WeatherRow>
    </Card>
  );
}

const Card = styled.article`
  min-width: 0;
  height: 98px;
  position: relative;
  display: grid;
  align-content: center;
  gap: 8px;
  padding: 14px 96px 14px 18px;
  border: 2px dashed ${({ $color }) => $color};
  border-radius: 8px;
  font-family: 'Coda Caption', sans-serif;
`;

const Location = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Duru Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
`;

const Pin = styled.span`
  display: inline-block;
  width: 21px;
  height: 21px;
  flex: 0 0 21px;
  color: ${({ $color }) => $color};
  background-color: currentColor;
  --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='black' d='M128 64a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m0-112a88.1 88.1 0 0 0-88 88c0 31.4 14.51 64.68 42 96.25a254.2 254.2 0 0 0 41.45 38.3a8 8 0 0 0 9.18 0a254.2 254.2 0 0 0 41.37-38.3c27.45-31.57 42-64.85 42-96.25a88.1 88.1 0 0 0-88-88m0 206c-16.53-13-72-60.75-72-118a72 72 0 0 1 144 0c0 57.23-55.47 105-72 118'/%3E%3C/svg%3E");
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
`;

const WeatherRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Temperature = styled.strong`
  color: ${({ $color }) => $color};
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
`;

const WeatherIcon = styled.span`
  display: inline-block;
  width: 77px;
  height: 77px;
  position: absolute;
  top: 50%;
  right: 10px;
  flex: 0 0 77px;
  color: ${({ $color }) => $color};
  background-color: currentColor;
  transform: translateY(-50%);
  -webkit-mask-image: url("${({ $icon }) => $icon}");
  mask-image: url("${({ $icon }) => $icon}");
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
`;

export default WeatherInfoCard;
