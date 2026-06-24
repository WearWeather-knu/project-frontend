import instance from '../api/instance';

// export const fetchWeather = ({ lat, lon, location_name }) => {
//   return instance.get('functions/v1/fetch-weather', {
//     params: {
//       lat,
//       lon,
//       location_name,
//     },
//   });
// };

export const fetchWeather = ({ lat, lon, location_name }) => {
  return instance.post('functions/v1/fetch-weather', {
    lat,
    lon,
    location_name,
  });
};

export const getWeatherComparison = (location_name) => {
  return instance.post('functions/v1/get-weather-comparison', { location_name });
};
