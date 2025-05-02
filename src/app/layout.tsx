import './globals.css';
import { headers } from 'next/headers';
import ContextProvider from '@/context/provider';

export const metadata = {
    title: 'Token Viewer',
    description: 'Просмотр токена на Polygon',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const headersObj = await headers();
    const cookies = headersObj.get('cookie') ?? null;

    return (
        <html lang="ru">
        <body>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
        </body>
        </html>
    );
}
