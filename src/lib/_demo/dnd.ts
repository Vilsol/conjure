const API_BASE = 'https://www.dnd5eapi.co/api';

type ListResponse = {
  results: {
    name: string;
    index: string;
  }[];
};

type Feature = {
  name: string;
  level: number;
  desc: string[];
};

let classesCache: ListResponse;

const classFeatureCache: {
  [key: string]: ListResponse;
} = {};

const featureCache: { [key: string]: Feature } = {};

export const getClasses = async (): Promise<ListResponse> => {
  if (!classesCache) {
    classesCache = await fetch(API_BASE + '/classes').then((data) => data.json());
  }

  return classesCache;
};

export const getFeatures = async (characterClass: string): Promise<ListResponse> => {
  if (!(characterClass in classFeatureCache)) {
    classFeatureCache[characterClass] = await fetch(API_BASE + '/classes/' + characterClass + '/features').then(
      (data) => data.json()
    );
  }

  return classFeatureCache[characterClass];
};

export const getFeature = async (feature: string): Promise<Feature> => {
  if (feature) {
    if (!(feature in featureCache)) {
      featureCache[feature] = await fetch(API_BASE + '/features/' + feature).then((data) => data.json());
    }

    return featureCache[feature];
  }

  return undefined;
};
