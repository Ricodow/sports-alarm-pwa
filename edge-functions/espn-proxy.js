const SPORT_URLS = {
  nfl: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
  nba: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
  mlb: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
  nhl: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard',
  mls: 'https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard',
  'college-football': 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard',
  'mens-college-basketball': 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export default async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const sport = url.searchParams.get('sport');

  if (!sport || !SPORT_URLS[sport]) {
    return new Response(
      JSON.stringify({ error: sport ? `Unknown sport: "${sport}"` : 'Missing required query param: sport' }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  try {
    const espnUrl = SPORT_URLS[sport];
    const response = await fetch(espnUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch ESPN data', details: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
