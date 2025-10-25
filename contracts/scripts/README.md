# Upload and Mint Script

Этот скрипт загружает метаданные NFT в IPFS через Pinata и опционально минтит NFT на контракте.

## Установка

```bash
npm install
```

## Использование

### 0. Предварительный просмотр данных

Сначала рекомендуется проверить, какие данные будут загружены:

```bash
npm run preview
```

Это покажет:
- Общее количество итемов
- Количество tradable итемов (которые будут загружены)
- Список первых 10 tradable итемов
- Пример структуры JSON

### 1. Только загрузка в IPFS (без минта)

```bash
npm run upload
```

или

```bash
npx tsx scripts/uploadAndMint.ts
```

Это загрузит все итемы с `tradable: 1` из `test.json` в IPFS в структуре:
```
ipfs://{hash}/0/{classid}.json
```

### 2. Загрузка в IPFS + Минт NFT

```bash
npx tsx scripts/uploadAndMint.ts <recipient> <privateKey> <rpcUrl> <contractAddress>
```

Пример:
```bash
npx tsx scripts/uploadAndMint.ts \
  0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f \
  0xYOUR_PRIVATE_KEY \
  https://rpc.ankr.com/eth \
  0xYOUR_CONTRACT_ADDRESS
```

или через npm:
```bash
npm run upload-and-mint -- 0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f 0xYOUR_PRIVATE_KEY https://rpc.ankr.com/eth 0xYOUR_CONTRACT_ADDRESS
```

## Параметры

- `recipient` (опционально): Адрес получателя NFT. По умолчанию: `0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f`
- `privateKey` (опционально): Приватный ключ для минта NFT
- `rpcUrl` (опционально): RPC URL блокчейна
- `contractAddress` (опционально): Адрес контракта LoreNFT

## Что делает скрипт

1. **Читает `test.json`** - загружает данные из файла
2. **Фильтрует итемы** - выбирает только с `tradable === 1`
3. **Загружает в IPFS** - создаёт структуру папок `0/{classid}.json` в Pinata
4. **Минтит NFT** (опционально) - вызывает `batchMint()` на контракте с `tokenId = classid`

## Вывод

Скрипт выводит:
- Количество найденных tradable итемов
- Прогресс загрузки в IPFS
- IPFS hash и base URI для эпохи
- Статус минта NFT (если включен)
- Примеры URL для проверки метаданных

## Пример вывода

```
🚀 Starting IPFS Upload and NFT Minting Script

   Epoch: 0
   Recipient: 0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f
   Minting: DISABLED

📖 Reading test.json...
   Total items in descriptions: 99
   Tradable items (tradable === 1): 3

📋 Sample tradable items:
   1. ClassID: 5224599512 - Dead Reckoning Chest
   2. ClassID: 4056581325 - Hallowed Chest of the Diretide
   3. ClassID: 2704470580 - Tail of the Netherfrost

📦 Preparing to upload 3 items to IPFS in folder structure...

✅ Uploaded folder structure to IPFS: ipfs://QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx
   Base URI for epoch 0: ipfs://QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx/0/

📊 Upload Summary:
   IPFS Hash: QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx
   Base URI: ipfs://QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx/0/
   Items uploaded: 3
   Example URI: ipfs://QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx/0/5224599512.json

✨ Script completed successfully!

📝 Next steps:
   1. Update your contract's baseUriEpoch to: ipfs://QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx/0/
   2. Verify metadata at: https://gateway.pinata.cloud/ipfs/QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx/0/5224599512.json
```

## Примечания

- Скрипт автоматически добавляет небольшую задержку между загрузками, чтобы избежать rate limiting
- Все учётные данные Pinata уже включены в скрипт
- Минт выполняется через batch mint для экономии газа
- TokenId в NFT = classid из metadata

