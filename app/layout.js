import './globals.css';
export const metadata={title:'Wirtschaftssimulator',description:'Vom Tante-Emma-Laden zum Verbrauchermarkt: Regale bestücken, Preise setzen, Personal führen – mit echten Preisen.'};
export const viewport={width:'device-width',initialScale:1,themeColor:'#111418'};
export default function RootLayout({children}){return <html lang="de"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/></head><body>{children}</body></html>}
