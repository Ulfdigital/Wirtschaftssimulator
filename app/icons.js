// Schlichte Linien-Symbole (24 × 24)
const D={
 shelves:'M4 3v18M20 3v18M4 8h16M4 13h16M4 18h16',
 cart:'M3 4h2l2.4 11h10.2L20 7H7M9 20a1 1 0 1 0 0-.1M17 20a1 1 0 1 0 0-.1',
 box:'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
 tag:'M3 12V4h8l10 10-8 8zM7.5 8.5a1 1 0 1 0 0-.1',
 grid:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
 build:'M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6',
 people:'M9 11a3.5 3.5 0 1 0 0-.1M2.5 20c.8-3.5 3.3-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3 3 0 0 1 0 6M18.5 14.5c1.6.8 2.6 2.6 3 5',
 hand:'M2 12l4-4 4 2 4-3 6 5-6 6-3-2-3 2-6-6M10 10l3 3M13 7l4 4',
 chart:'M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3',
 flag:'M5 21V4M5 4h11l-2 4 2 4H5',
 bag:'M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2',
 play:'M7 5v14l11-7z',sun:'M12 7a5 5 0 1 0 .1 0M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3',
 close:'M6 6l12 12M18 6L6 18',plus:'M12 5v14M5 12h14',check:'M5 12l5 5 9-10',star:'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',lock:'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4'
};
export function Icon({name,size=20,stroke=1.7}){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={D[name]}/></svg>;}
