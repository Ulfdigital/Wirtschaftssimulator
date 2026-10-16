'use client';
export const euro=(c,d=2)=>(c/100).toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d})+' €';
export const euroK=c=>Math.abs(c)>=1e8?(c/1e8).toLocaleString('de-DE',{maximumFractionDigits:2})+' Mio. €':euro(c,Math.abs(c)>=1e6?0:2);
export const num=n=>Number(n).toLocaleString('de-DE',{maximumFractionDigits:1});
export const pct=x=>(x*100).toLocaleString('de-DE',{maximumFractionDigits:0})+' %';
export function Bar({share,tone='brass',label}){return <div className={'bar '+tone} role="progressbar" aria-label={label} aria-valuenow={Math.round(share*100)} aria-valuemin="0" aria-valuemax="100"><span style={{width:Math.max(0,Math.min(1,share))*100+'%'}}/></div>;}
export function Section({title,children,aside}){return <section className="sec"><header><h3>{title}</h3>{aside}</header>{children}</section>;}
export function Stat({label,value,sub,tone}){return <div className={'stat '+(tone||'')}><span>{label}</span><b>{value}</b>{sub&&<small>{sub}</small>}</div>;}
