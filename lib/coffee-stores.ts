import { createApi } from 'unsplash-js';

export interface Place {
  fsq_id: string;
  categories: [
    {
      id: number;
      name: string;
      icon: {
        prefix: string;
        suffix: string;
      };
    },
    {
      id: number;
      name: string;
      icon: {
        prefix: string;
        suffix: string;
      };
    }
  ];
  chains: any[];
  distance: number;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
    roof: {
      latitude: number;
      longitude: number;
    };
  };
  link: string;
  location: {
    address: string;
    country: string;
    cross_street: string;
    formatted_address: string;
    locality: string;
    post_town?: string;
    postcode: string;
    region: string;
  };
  name: string;
  related_places: {};
  timezone: string;
}

export interface Data {
  results: Place[];
}

export interface CoffeeStore {
  id: string;
  name: string;
  imgUrl: string | null;
  address: string;
  neighborhood: string;
}

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
});

const getUrlForCoffeeStores = (near: string, query: string, limit: number) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&near=${near}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: 'coffee shop',
    page: 1,
    perPage: 30,
  });

  const unsplashResults = photos.response?.results;

  return unsplashResults?.map((result) => result.urls.small);
};

const NEAR = 'Sao Paulo';
const QUERY = 'coffee';
const LIMIT = 6;

export const fetchCoffeeStores = async (): Promise<CoffeeStore[]> => {
  const photos = await getListOfCoffeeStorePhotos();
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.FOURSQUARE_API_KEY || '',
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores(NEAR, QUERY, LIMIT),
    options
  );
  const data: Data = await response.json();

  const formatNeighborhood = (arg?: string): string | undefined => {
    if (!arg) return;

    if (arg.includes('[') && arg.includes(']')) {
      return arg.replace('["', '').replace('"]', '');
    }

    return arg;
  };

  return data.results.map(
    ({ fsq_id, name, location: { address, post_town } }, idx) => {
      return {
        id: fsq_id,
        name,
        address: address || '',
        neighborhood: formatNeighborhood(post_town) || '',
        imgUrl: photos?.length ? photos[idx] : null,
      };
    }
  );
};
