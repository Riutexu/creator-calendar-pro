import type { SteamGridDBGame, SteamGridDBImage, SteamGridDBSearchResponse, SteamGridDBImagesResponse } from '@/types';

const STEAMGRIDDB_BASE_URL = 'https://www.steamgriddb.com/api/v2';

export class SteamGridDBClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = STEAMGRIDDB_BASE_URL;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('API Key inválida o expirada');
      }
      if (response.status === 429) {
        throw new Error('Límite de peticiones excedido. Intenta más tarde.');
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async searchGames(term: string): Promise<SteamGridDBGame[]> {
    if (!term.trim()) return [];

    const encodedTerm = encodeURIComponent(term.trim());
    const response = await this.request<SteamGridDBSearchResponse>(`/search/autocomplete/${encodedTerm}`);
    return response.data || [];
  }

  async getGameById(gameId: number): Promise<SteamGridDBGame | null> {
    try {
      const response = await this.request<{ success: boolean; data: SteamGridDBGame }>(`/games/${gameId}`);
      return response.data || null;
    } catch {
      return null;
    }
  }

  async getGrids(gameId: number): Promise<SteamGridDBImage[]> {
    const response = await this.request<SteamGridDBImagesResponse>(`/grids/game/${gameId}`);
    return (response.data || []).filter(img => img.type === 'grid' && img.width === 600 && img.height === 900);
  }

  async getHeroes(gameId: number): Promise<SteamGridDBImage[]> {
    const response = await this.request<SteamGridDBImagesResponse>(`/heroes/game/${gameId}`);
    return (response.data || []).filter(img => img.type === 'hero' && img.width === 920 && img.height === 430);
  }

  async getLogos(gameId: number): Promise<SteamGridDBImage[]> {
    const response = await this.request<SteamGridDBImagesResponse>(`/logos/game/${gameId}`);
    return response.data || [];
  }

  async getBestCover(gameId: number): Promise<{ grid?: string; hero?: string; logo?: string }> {
    const [grids, heroes, logos] = await Promise.all([
      this.getGrids(gameId),
      this.getHeroes(gameId),
      this.getLogos(gameId),
    ]);

    return {
      grid: grids[0]?.url,
      hero: heroes[0]?.url,
      logo: logos[0]?.url,
    };
  }

  async testConnection(): Promise<{ valid: boolean; message: string }> {
    try {
      await this.request<{ success: boolean }>('/profile');
      return { valid: true, message: 'Conexión exitosa' };
    } catch (error) {
      return { valid: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }
}

export function createSteamGridDBClient(apiKey: string): SteamGridDBClient {
  return new SteamGridDBClient(apiKey);
}

export function getImageUrl(image: SteamGridDBImage | string | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url;
}

export function getOptimizedImageUrl(url: string, width: number, height: number): string {
  if (!url) return '';
  return `${url}?w=${width}&h=${height}&fit=crop`;
}

export const POPULAR_GAMES_FALLBACK = [
  { name: 'R.E.P.O.', searchTerms: ['R.E.P.O.', 'REPO'] },
  { name: 'Minecraft', searchTerms: ['Minecraft'] },
  { name: 'Resident Evil 4 Remake', searchTerms: ['Resident Evil 4', 'RE4 Remake'] },
  { name: 'Valorant', searchTerms: ['Valorant'] },
  { name: 'League of Legends', searchTerms: ['League of Legends', 'LoL'] },
  { name: 'Counter-Strike 2', searchTerms: ['Counter-Strike 2', 'CS2'] },
  { name: 'Apex Legends', searchTerms: ['Apex Legends'] },
  { name: 'Fortnite', searchTerms: ['Fortnite'] },
  { name: 'Call of Duty: Warzone', searchTerms: ['Warzone', 'Call of Duty Warzone'] },
  { name: 'Grand Theft Auto V', searchTerms: ['GTA V', 'GTA 5', 'Grand Theft Auto V'] },
  { name: 'Elden Ring', searchTerms: ['Elden Ring'] },
  { name: 'Baldur\'s Gate 3', searchTerms: ['Baldur\'s Gate 3', 'BG3'] },
  { name: 'Cyberpunk 2077', searchTerms: ['Cyberpunk 2077'] },
  { name: 'The Witcher 3', searchTerms: ['The Witcher 3', 'Witcher 3'] },
  { name: 'Red Dead Redemption 2', searchTerms: ['RDR2', 'Red Dead Redemption 2'] },
  { name: 'Among Us', searchTerms: ['Among Us'] },
  { name: 'Phasmophobia', searchTerms: ['Phasmophobia'] },
  { name: 'Lethal Company', searchTerms: ['Lethal Company'] },
  { name: 'Content Warning', searchTerms: ['Content Warning'] },
  { name: 'Dead by Daylight', searchTerms: ['Dead by Daylight', 'DBD'] },
];