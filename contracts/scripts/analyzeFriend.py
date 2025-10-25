#!/usr/bin/env python3
"""
Script to analyze friend.json and show item types
"""
import json
from collections import Counter

print('🔍 Analyzing friend.json...\n')

with open('friend.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

items = data.get('descriptions', [])
print(f'Total items: {len(items)}\n')

# Show first few items
print('📋 First 5 items:')
for i, item in enumerate(items[:5]):
    print(f"\n{i+1}. Name: {item.get('name', 'N/A')}")
    print(f"   Type: {item.get('type', 'N/A')}")
    print(f"   ClassID: {item.get('classid', 'N/A')}")
    print(f"   Tradable: {item.get('tradable', 'N/A')}")

# Count types
type_counter = Counter(item.get('type', 'Unknown') for item in items)
print('\n\n📊 Item types distribution:')
for item_type, count in type_counter.most_common():
    print(f'   {item_type}: {count}')

# Search for treasury/loading screen related items
print('\n\n🔎 Searching for treasury/loading screen items:')
keywords = ['treasury', 'treasure', 'loading', 'screen', 'хранилище', 'сокровищ', 'загрузочн']
found_items = []

for item in items:
    item_str = json.dumps(item, ensure_ascii=False).lower()
    for keyword in keywords:
        if keyword.lower() in item_str:
            found_items.append((item, keyword))
            break

if found_items:
    print(f'   Found {len(found_items)} items:')
    for item, keyword in found_items[:10]:
        print(f'   - {item.get("name")} (matched: {keyword})')
else:
    print('   No items found with these keywords')

