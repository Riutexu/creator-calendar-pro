import type { APIRoute } from 'astro';
import { createSteamGridDBClient } from '@/lib/steamgriddb';

export const GET: APIRoute = async ({ request, params }) => {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  const gameId = url.searchParams.get('gameId');
  const query = url.searchParams.get('query');

  const apiKey = request.headers.get('X-SteamGridDB-Key');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API Key requerida' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const client = createSteamGridDBClient(apiKey);

  try {
    switch (action) {
      case 'search': {
        if (!query) {
          return new Response(JSON.stringify({ error: 'Query requerida' }), { status: 400 });
        }
        const results = await client.searchGames(query);
        return new Response(JSON.stringify({ success: true, data: results.slice(0, 10) }), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
        });
      }

      case 'covers': {
        if (!gameId) {
          return new Response(JSON.stringify({ error: 'gameId requerido' }), { status: 400 });
        }
        const [grids, heroes, logos] = await Promise.all([
          client.getGrids(parseInt(gameId)),
          client.getHeroes(parseInt(gameId)),
          client.getLogos(parseInt(gameId)),
        ]);
        return new Response(JSON.stringify({ success: true, data: { grids, heroes, logos } }), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
        });
      }

      case 'best-cover': {
        if (!gameId) {
          return new Response(JSON.stringify({ error: 'gameId requerido' }), { status: 400 });
        }
        const cover = await client.getBestCover(parseInt(gameId));
        return new Response(JSON.stringify({ success: true, data: cover }), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Acción no válida' }), { status: 400 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};