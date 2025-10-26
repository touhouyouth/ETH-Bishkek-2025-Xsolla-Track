import { NextRequest, NextResponse } from 'next/server';

const STEAM_API_KEY = "12FFC7AAAC5FCBB897065054BB3E907E";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const steamId = searchParams.get('steamid');
    
    if (!steamId) {
      return NextResponse.json({ error: 'Steam ID is required' }, { status: 400 });
    }
    
    console.log(`📡 Proxying Steam API request for steamId: ${steamId}`);
    
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steamId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Successfully proxied Steam API response:`, data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error proxying Steam API request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Steam player info',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
