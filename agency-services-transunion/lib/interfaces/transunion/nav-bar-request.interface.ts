export interface INavBarRequest {
  id: string;
  navBar: INavBar;
}

export interface INavBar {
  home?: INavBarItem;
  report?: INavBarItem;
  disputes?: INavBarItem;
  settings?: INavBarItem;
}

export interface INavBarItem {
  badge?: boolean;
}
