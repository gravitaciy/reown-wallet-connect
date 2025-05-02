'use client';

import { wagmiAdapter, projectId, networks } from './wagmi';
import { createAppKit } from '@reown/appkit/react';

const metadata = {
    name: 'Token Viewer',
    description: 'Просмотр токена на Polygon',
    url: 'http://localhost:3000',
    icons: [],
};

// @ts-ignore
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
