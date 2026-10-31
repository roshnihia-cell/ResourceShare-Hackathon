import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'ResourceShare — Fair access, real possibilities',description:'A trusted campus workspace for sharing equipment, spaces and ideas.'};
export default function Layout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
