'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { erc20Abi, createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';

const TOKEN_ADDRESS = '0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b';

const client = createPublicClient({
  chain: polygon,
  transport: http(),
});

export default function Home() {
  const { address, isConnected } = useAccount();
  const [tokenInfo, setTokenInfo] = useState<{
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
  } | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [name, symbol, decimals, totalSupplyRaw] = await Promise.all([
          client.readContract({
            address: TOKEN_ADDRESS,
            abi: erc20Abi,
            functionName: 'name',
          }),
          client.readContract({
            address: TOKEN_ADDRESS,
            abi: erc20Abi,
            functionName: 'symbol',
          }),
          client.readContract({
            address: TOKEN_ADDRESS,
            abi: erc20Abi,
            functionName: 'decimals',
          }),
          client.readContract({
            address: TOKEN_ADDRESS,
            abi: erc20Abi,
            functionName: 'totalSupply',
          }),
        ]);

        const totalSupply = formatUnits(totalSupplyRaw as bigint, decimals as number);

        setTokenInfo({ name, symbol, decimals, totalSupply });
      } catch (e) {
        console.error('Ошибка при получении данных токена', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isConnected || !address || !tokenInfo) return;

    (async () => {
      try {
        const rawBalance = await client.readContract({
          address: TOKEN_ADDRESS,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [address],
        });

        setBalance(formatUnits(rawBalance as bigint, tokenInfo.decimals));
      } catch (e) {
        console.error('Ошибка при получении баланса', e);
      }
    })();
  }, [isConnected, address, tokenInfo]);

  return (
      <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
        <h1>Информация о токене</h1>
        {tokenInfo ? (
            <>
              <p><strong>Название:</strong> {tokenInfo.name}</p>
              <p><strong>Символ:</strong> {tokenInfo.symbol}</p>
              <p><strong>Decimals:</strong> {tokenInfo.decimals}</p>
              <p><strong>Total Supply:</strong> {tokenInfo.totalSupply}</p>
            </>
        ) : (
            <p>Загрузка данных токена...</p>
        )}

        <hr style={{ margin: '20px 0' }} />

        <appkit-button />

        {isConnected && balance && (
            <p style={{ marginTop: 16 }}>
              <strong>Ваш адрес:</strong> {address}<br />
              <strong>Ваш баланс:</strong> {balance} {tokenInfo?.symbol}
            </p>
        )}
      </main>
  );
}
