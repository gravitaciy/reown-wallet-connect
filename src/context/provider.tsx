'use client';

import { wagmiAdapter, projectId, networks } from './wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';
import { createAppKit } from '@reown/appkit/react'; // Правильный импорт

const queryClient = new QueryClient();

// Метаданные для AppKit
const metadata = {
    name: 'Token Viewer',
    description: 'Просмотр токена на Polygon',
    url: 'http://localhost:3000',
    icons: [],
};

// Инициализация AppKit
createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    defaultNetwork: networks[0],
    metadata,
    features: {
        analytics: true,
    },
});

export default function ContextProvider({
    children,
    cookies,
}: {
    children: React.ReactNode;
    cookies: string | null;
}) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}