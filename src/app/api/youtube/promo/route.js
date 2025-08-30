import { NextResponse } from 'next/server';

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const CACHE_TTL = parseInt(process.env.YOUTUBE_CACHE_TTL_SECONDS || '3600', 10);

export const revalidate = CACHE_TTL;

export async function GET() {
  if (!API_KEY || !CHANNEL_ID) {
    return NextResponse.json(
      { error: 'Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID' },
      { status: 500 }
    );
  }

  try {
    // Fetch channel info
    const channelParams = new URLSearchParams({
      part: 'snippet,statistics,contentDetails',
      id: CHANNEL_ID,
      key: API_KEY,
    });

    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?${channelParams.toString()}`,
      { cache: 'no-store' }
    );

    if (!channelRes.ok) {
      const err = await channelRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.error?.message || 'Failed to fetch channel data' },
        { status: channelRes.status }
      );
    }

    const channelJson = await channelRes.json();
    const channelItem = channelJson.items?.[0];
    if (!channelItem) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const channelInfo = {
      title: channelItem.snippet?.title || '',
      subscriberCount: Number(channelItem.statistics?.subscriberCount || 0),
      videoCount: Number(channelItem.statistics?.videoCount || 0),
      url: `https://www.youtube.com/channel/${CHANNEL_ID}`,
      isLive: false,
    };

    // Check live status
    try {
      const liveParams = new URLSearchParams({
        part: 'id',
        channelId: CHANNEL_ID,
        eventType: 'live',
        type: 'video',
        maxResults: '1',
        key: API_KEY,
      });
      const liveRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${liveParams.toString()}`,
        { cache: 'no-store' }
      );
      if (liveRes.ok) {
        const liveJson = await liveRes.json();
        channelInfo.isLive = Array.isArray(liveJson.items) && liveJson.items.length > 0;
      }
    } catch {
      channelInfo.isLive = false;
    }

    // Fetch latest videos
    const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;
    let videos = [];
    if (uploadsPlaylistId) {
      const playlistParams = new URLSearchParams({
        part: 'snippet',
        playlistId: uploadsPlaylistId,
        maxResults: '4',
        key: API_KEY,
      });
      const playlistRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?${playlistParams.toString()}`,
        { cache: 'no-store' }
      );
      if (playlistRes.ok) {
        const playlistJson = await playlistRes.json();
        const videoIds = playlistJson.items
          ?.map((item) => item.snippet?.resourceId?.videoId)
          .filter(Boolean);
        if (videoIds && videoIds.length) {
          const videosParams = new URLSearchParams({
            part: 'snippet,contentDetails,statistics,liveStreamingDetails',
            id: videoIds.join(','),
            key: API_KEY,
          });
          const videosRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?${videosParams.toString()}`,
            { cache: 'no-store' }
          );
          if (videosRes.ok) {
            const videosJson = await videosRes.json();
            videos = videosJson.items?.map((v) => {
              const isLive = v.snippet?.liveBroadcastContent === 'live';
              return {
                id: v.id,
                title: v.snippet?.title || '',
                publishedAt: v.snippet?.publishedAt || '',
                thumbnailUrl: v.snippet?.thumbnails?.medium?.url || '',
                duration: isLive ? 'LIVE' : formatDuration(v.contentDetails?.duration),
                viewCount: isLive
                  ? Number(v.liveStreamingDetails?.concurrentViewers || 0)
                  : Number(v.statistics?.viewCount || 0),
                isLive,
                url: `https://www.youtube.com/watch?v=${v.id}`,
              };
            }) || [];
          }
        }
      }
    }

    return NextResponse.json({ channel: channelInfo, videos });
  } catch (error) {
    console.error('YouTube promo API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch YouTube data' },
      { status: 500 }
    );
  }
}

function formatDuration(iso) {
  if (!iso) return null;
  const match = iso.match(/PT(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/);
  if (!match) return null;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  const parts = [];
  if (hours) parts.push(hours);
  parts.push(hours ? String(minutes).padStart(2, '0') : String(minutes));
  parts.push(String(seconds).padStart(2, '0'));
  return parts.join(':');
}

