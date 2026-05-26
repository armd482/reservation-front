interface AddThemeRequest {
  name: string;
  description: string;
  url: string;
}

interface ThemeData extends AddThemeRequest {
  id: number;
}

interface PopularThemeData extends ThemeData {
  count: number;
}
