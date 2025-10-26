# React Query хуки для LoreNFT

Этот набор хуков предоставляет полную интеграцию с контрактом LoreNFT используя @tanstack/react-query для кэширования, управления состоянием и оптимистичных обновлений.

## Установка и настройка

Убедитесь, что у вас установлены необходимые зависимости:

```bash
npm install @tanstack/react-query wagmi viem
```

## Основные хуки

### 1. Чтение данных контракта

#### `useLoreNftInfo()`
Получает основную информацию о контракте:
- name - название контракта
- symbol - символ токена
- totalSupply - общее количество токенов
- maxMintedId - максимальный ID токена

```typescript
const contractInfo = useLoreNftInfo();
console.log(contractInfo.name); // "LoreNFT"
console.log(contractInfo.totalSupply); // 1000n
```

#### `useLoreNftBalance(address)`
Получает баланс NFT для указанного адреса:

```typescript
const { address } = useAccount();
const balance = useLoreNftBalance(address);
console.log(balance.data); // 5n
```

#### `useLoreNftTokensOfOwner(address)`
Получает список токенов пользователя:

```typescript
const tokens = useLoreNftTokensOfOwner(address);
console.log(tokens.data); // [1n, 2n, 3n]
```

#### `useLoreNftToken(tokenId)`
Получает информацию о конкретном токене:

```typescript
const tokenInfo = useLoreNftToken(1n);
console.log(tokenInfo.tokenUri); // "https://..."
console.log(tokenInfo.owner); // "0x..."
```

### 2. Мутации (запись в контракт)

#### `useLoreNftMint()`
Минтинг нового NFT:

```typescript
const mintMutation = useLoreNftMint();

const handleMint = async () => {
  try {
    const hash = await mintMutation.mutateAsync("0x...");
    console.log("Транзакция:", hash);
  } catch (error) {
    console.error("Ошибка минтинга:", error);
  }
};
```

#### `useLoreNftTransferFrom()`
Передача NFT:

```typescript
const transferMutation = useLoreNftTransferFrom();

const handleTransfer = async () => {
  await transferMutation.mutateAsync({
    from: "0x...",
    to: "0x...",
    tokenId: 1n
  });
};
```

### 3. Специализированные хуки

#### `useLoreNftUserProfile()`
Получает полный профиль пользователя:

```typescript
const profile = useLoreNftUserProfile();
console.log(profile.balance); // 5n
console.log(profile.tokens); // [1n, 2n, 3n]
```

#### `useLoreNftCollectionWithMetadata(address)`
Получает коллекцию пользователя с метаданными:

```typescript
const collection = useLoreNftCollectionWithMetadata(address);
collection.tokensWithMetadata.forEach(token => {
  console.log(token.metadata?.name);
  console.log(token.metadata?.image);
});
```

### 4. Хуки с оптимистичными обновлениями

#### `useLoreNftMintWithOptimisticUpdate()`
Минтинг с мгновенным обновлением UI:

```typescript
const mintWithOptimistic = useLoreNftMintWithOptimisticUpdate();

// UI обновится мгновенно, даже если транзакция еще не подтверждена
await mintWithOptimistic.mutateAsync("0x...");
```

#### `useLoreNftTransferWithOptimisticUpdate()`
Передача с мгновенным обновлением UI:

```typescript
const transferWithOptimistic = useLoreNftTransferWithOptimisticUpdate();

await transferWithOptimistic.mutateAsync({
  from: "0x...",
  to: "0x...",
  tokenId: 1n
});
```

## Пример использования

```typescript
import { 
  useLoreNftInfo, 
  useLoreNftUserProfile, 
  useLoreNftMintWithOptimisticUpdate 
} from '@/hooks';

function NFTDashboard() {
  const { address } = useAccount();
  const contractInfo = useLoreNftInfo();
  const userProfile = useLoreNftUserProfile();
  const mintMutation = useLoreNftMintWithOptimisticUpdate();

  const handleMint = async () => {
    if (!address) return;
    await mintMutation.mutateAsync(address);
  };

  return (
    <div>
      <h1>{contractInfo.name}</h1>
      <p>Ваш баланс: {userProfile.balance.toString()}</p>
      <button onClick={handleMint}>
        Заминтить NFT
      </button>
    </div>
  );
}
```

## Особенности

### Кэширование
- Все данные автоматически кэшируются
- Настраиваемое время жизни кэша (staleTime)
- Автоматическая инвалидация при изменениях

### Оптимистичные обновления
- UI обновляется мгновенно
- Автоматический откат при ошибках
- Улучшенный пользовательский опыт

### Типизация
- Полная поддержка TypeScript
- Типизированные параметры и возвращаемые значения
- Автокомплит в IDE

### Обработка ошибок
- Встроенная обработка ошибок
- Retry логика
- Пользовательские сообщения об ошибках

## Настройка React Query

Убедитесь, что у вас настроен QueryClient:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Ваше приложение */}
    </QueryClientProvider>
  );
}
```

## Доступные хуки

### Чтение данных
- `useLoreNftInfo()` - информация о контракте
- `useLoreNftBalance(address)` - баланс пользователя
- `useLoreNftTokensOfOwner(address)` - токены пользователя
- `useLoreNftToken(tokenId)` - информация о токене
- `useLoreNftSettings()` - настройки контракта

### Мутации
- `useLoreNftMint()` - минтинг NFT
- `useLoreNftBatchMint()` - батч минтинг
- `useLoreNftApprove()` - одобрение токена
- `useLoreNftTransferFrom()` - передача токена
- `useLoreNftSafeTransferFrom()` - безопасная передача

### Специализированные
- `useLoreNftUserProfile()` - профиль пользователя
- `useLoreNftCollectionWithMetadata()` - коллекция с метаданными
- `useLoreNftMintWithOptimisticUpdate()` - минтинг с оптимистичными обновлениями
- `useLoreNftTransferWithOptimisticUpdate()` - передача с оптимистичными обновлениями

Все хуки полностью типизированы и готовы к использованию в production!
