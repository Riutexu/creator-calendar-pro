import type { SteamGridDBGame, SteamGridDBImage } from '@/types';

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
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async searchGames(term: string): Promise<SteamGridDBGame[]> {
    if (!term.trim()) return [];
    const encodedTerm = encodeURIComponent(term.trim());
    const response = await this.request<{ success: boolean; data: SteamGridDBGame[] }>(`/search/autocomplete/${encodedTerm}`);
    return response.data || [];
  }

  async getGrids(gameId: number): Promise<SteamGridDBImage[]> {
    const response = await this.request<{ success: boolean; data: SteamGridDBImage[] }>(`/grids/game/${gameId}`);
    return (response.data || []).filter(img => img.type === 'grid' && img.width === 600 && img.height === 900);
  }

  async getHeroes(gameId: number): Promise<SteamGridDBImage[]> {
    const response = await this.request<{ success: boolean; data: SteamGridDBImage[] }>(`/heroes/game/${gameId}`);
    return (response.data || []).filter(img => img.type === 'hero' && img.width === 920 && img.height === 430);
  }

  async getLogos(gameId: number): Promise<SteamGridDBImage[]> {
    const response = await this.request<{ success: boolean; data: SteamGridDBImage[] }>(`/logos/game/${gameId}`);
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