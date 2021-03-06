export interface CityData {
  num_dpt: number;
  latitude: number;
  longitude: number;
  nom_ddpt: string;
  nom_commune: string;
  codes_postaux: string;
  dist: number;
  str: string,
}

export interface CityDisplayData extends CityData {
  is_pivot?: boolean;
}