# Jpostcode

Jpostcodeは、郵便番号から日本の住所を検索するためのライブラリです。都道府県、市区町村、町域名を、漢字とカナの両方で詳細に提供します。

## インストール

npmを使用してライブラリをインストールします:

```bash
npm install jpostcode
```

## 使い方

基本的な使用例を以下に示します:

### JavaScript

```javascript
const { Jpostcode } = require('jpostcode');

// 郵便番号から住所を検索
const addresses = Jpostcode.find('0010000');

if (addresses.length > 0) {
  // 1つの郵便番号から複数の住所が見つかる場合があります
  for (const address of addresses) {
    console.log(`都道府県: ${address.prefecture} (${address.prefectureKana})`);
    console.log(`市区町村: ${address.city} (${address.cityKana})`);
    console.log(`町域: ${address.town} (${address.townKana})`);
    console.log(`郵便番号: ${address.zipCode}`);
  }
} else {
  console.log('住所が見つかりませんでした。');
}
```

### TypeScript

```typescript
import { Address, Jpostcode } from 'jpostcode';

// 郵便番号から住所を検索
const addresses:Address[] = Jpostcode.find('0010000');

if (addresses.length > 0) {
  // 1つの郵便番号から複数の住所が見つかる場合があります
  for (const address of addresses) {
    console.log(`都道府県: ${address.prefecture} (${address.prefectureKana})`);
    console.log(`市区町村: ${address.city} (${address.cityKana})`);
    console.log(`町域: ${address.town} (${address.townKana})`);
    console.log(`郵便番号: ${address.zipCode}`);
  }
} else {
  console.log('住所が見つかりませんでした。');
}
```

### Webブラウザでの使用

Webアプリケーションでは、AJAX版またはBundle版のいずれかを使用できます:

#### AJAX版（ほとんどのケースで推奨）

```html
<!-- AJAX版を読み込み -->
<script src="https://cdn.jsdelivr.net/npm/jpostcode@latest/dist/jpostcode-web.js"></script>

<script>
// データファイルのベースURLを設定（オプション、デフォルトは './data/json/'）
Jpostcode.setBaseUrl('https://your-cdn.com/jpostcode-data/');

// 住所を検索（Promiseを返します）
Jpostcode.find('1000001').then(addresses => {
  if (addresses.length > 0) {
    for (const address of addresses) {
      console.log(`都道府県: ${address.prefecture}`);
      console.log(`市区町村: ${address.city}`);
      console.log(`町域: ${address.town}`);
    }
  }
});
</script>
```

#### Bundle版（全データ同梱）

```html
<!-- Bundle版を読み込み（ファイルサイズは大きいですが、オフラインでも動作します） -->
<script src="https://cdn.jsdelivr.net/npm/jpostcode@latest/dist/jpostcode-web-bundle.js"></script>

<script>
// 住所を検索（同期処理）
const addresses = Jpostcode.find('1000001');
if (addresses.length > 0) {
  for (const address of addresses) {
    console.log(`都道府県: ${address.prefecture}`);
    console.log(`市区町村: ${address.city}`);
    console.log(`町域: ${address.town}`);
  }
}
</script>
```

## 機能

- **郵便番号による住所検索**: 郵便番号を使用して詳細な住所情報を取得
- **存在しない郵便番号への対応**: 郵便番号が存在しない場合は空の配列を返却
- **Webブラウザ対応**: WebアプリケーションのためのAJAX版とBundle版を提供
- **TypeScript対応**: 完全なTypeScript型定義を含む
- **データの自動更新**: ソースデータが変更されると郵便番号データを自動更新

## ビルドとテスト

プロジェクトをビルドするには:

```bash
npm run build
```

テストを実行するには:

```bash
npm test
```

## 貢献

貢献を歓迎します！GitHubでissueを開くか、プルリクエストを送信してください。

## 謝辞

このプロジェクトは [jpostcode-data](https://github.com/kufu/jpostcode-data) ライブラリのデータを使用しています。このライブラリのメンテナと貢献者の皆様に感謝いたします。

## GitHub Pagesデモ

このプロジェクトには、ライブラリの機能を日本語で紹介するGitHub Pagesデモサイトが含まれています。

### ライブデモ

ライブデモは以下で公開されています: https://matzlika.github.io/jpostcode-js/

### GitHub Pagesの設定

1. リポジトリのSettingsタブに移動
2. 左サイドバーの"Pages"に移動
3. "Source"で"GitHub Actions"を選択
4. mainブランチにプッシュすると自動的にデプロイされます

### ローカル開発

デモサイトをローカルで実行するには:

```bash
# まずプロジェクトをビルド
npm run build

# データファイルへのシンボリックリンクを作成（まだ作成していない場合）
cd docs && ln -s ../jpostcode-data/data data && cd ..

# 静的ファイルサーバーでdocsディレクトリを配信
# 例: Pythonを使用する場合
python -m http.server 8000 --directory docs

# または Node.js http-serverを使用する場合
npx http-server docs -p 8000
```

その後、ブラウザで `http://localhost:8000` を開きます。

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。

---

**English version**: [README.en.md](README.en.md)
