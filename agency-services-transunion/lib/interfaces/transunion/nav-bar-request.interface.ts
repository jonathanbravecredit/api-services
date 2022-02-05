export interface INavBarRequest {
  id: string;
  home?: INavBarItem;
  report?: INavBarItem;
  disputes?: INavBarItem;
  settings?: INavBarItem;
}

export interface INavBarItem {
  badge?: boolean;
}
