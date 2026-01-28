
import React from 'react';

interface SpotifyWidgetProps {
    city: string;
}

export const SpotifyWidget: React.FC<SpotifyWidgetProps> = ({ city }) => {
    // We can't auto-generate a playlist without an API key content.
    // So we'll embed a "Travel" genre playlist and link to search.

    // Fallback playlist: "Travel & Explore" or similar popular one
    // URI: spotify:playlist:37i9dQZF1DX9X1pUK6V6yQ (Travel Mix? Just an example ID)
    // Using a generic "Travel" playlist ID for now: 37i9dQZF1DXcBWIGoYBM5M (Today's Top Hits? No)
    // Let's use "Travel Vibe" - 37i9dQZF1DWTx0xog3gN3q (Calm Vibes)

    // Better strategy: Embed a search link or a fixed travel playlist.
    const playlistId = "37i9dQZF1DWV7EzJMK2FUI"; // "Jazz in the Background" - safe fallback

    return (
        <div className="bg-black/90 rounded-3xl p-6 text-white shadow-xl overflow-hidden relative group">
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png" alt="Spotify" className="h-6" />
                    <h3 className="font-bold">Vibes for {city}</h3>
                </div>
                <a
                    href={`https://open.spotify.com/search/${encodeURIComponent(city + " travel")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs bg-[#1DB954] text-black font-bold px-3 py-1 rounded-full hover:scale-105 transition-transform"
                >
                    Find Playlist ↗
                </a>
            </div>

            <iframe
                style={{ borderRadius: '12px' }}
                src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Embed"
            ></iframe>

            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1DB954] blur-[80px] opacity-20 pointer-events-none"></div>
        </div>
    );
};
