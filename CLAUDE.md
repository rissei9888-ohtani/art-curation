@AGENTS.md

# ArtFeed — アーティストキュレーションサイト

## プロジェクト概要

絵画・イラスト系アーティストを発掘・紹介するキュレーションサイト。
SNSフィード型UIで作品を縦スクロールで閲覧できる。

## 技術スタック

| 種別 | 技術 |
|------|------|
| フレームワーク | Next.js 15（App Router） |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| UIコンポーネント | shadcn/ui |
| バックエンド/DB | Supabase（PostgreSQL + Auth + Storage） |
| デプロイ先 | Vercel（モックモードで稼働中） |

## ディレクトリ構成

```
src/
├── app/
│   ├── (public)/            # 一般ユーザー向けページ
│   │   ├── page.tsx         # フィードトップ
│   │   └── artists/[id]/    # アーティスト詳細
│   ├── admin/               # 管理者ページ（要認証）
│   │   ├── page.tsx         # アーティスト一覧
│   │   └── artists/
│   │       ├── new/         # 新規登録
│   │       └── [id]/edit/   # 編集・作品管理
│   └── login/               # ログインページ
├── components/
│   ├── feed/                # フィード表示コンポーネント
│   └── admin/               # 管理画面コンポーネント
├── lib/supabase/            # Supabaseクライアント
├── middleware.ts            # 認証ガード
└── types/index.ts           # 型定義
supabase/
└── schema.sql               # DBスキーマ・RLS設定
```

## 現在の実装状態（2026-04-03時点）

### 完了済み
- Next.js 15 + TypeScript + Tailwind CSS v4 + shadcn/ui の初期セットアップ
- Supabaseクライアント設定（ブラウザ用・サーバー用）
- 認証ミドルウェア（`/admin` 以下を保護）
- フィード一覧ページ（タグ絞り込み対応）
- アーティスト詳細ページ（プロフィール + 作品グリッド）
- 管理者ログイン / ログアウト
- アーティスト新規登録・編集フォーム（アバター画像アップロード含む）
- 作品追加・削除（画像アップロード + タグ紐付け）
- DBスキーマ + RLS設定（`supabase/schema.sql`）
- **モックデータによるローカル動作確認対応**（`src/lib/data.ts` + `src/lib/mock-data.ts`）
- `next/image` 外部ドメイン設定（picsum.photos + Supabase Storage）
- GitHubリポジトリ作成・push（`rissei9888-ohtani/art-curation`）
- Vercel デプロイ（モックモードで稼働中）

### 未着手（次回以降）
- Supabaseプロジェクトの実際の作成・接続（`.env.local` の値を更新 + Vercel 環境変数を更新して `NEXT_PUBLIC_USE_MOCK` を削除）
- 動作確認・デバッグ（Supabase接続後）
- お気に入り機能の本実装（DBスキーマのみ定義済み）

## モック開発モード

`.env.local` の `NEXT_PUBLIC_USE_MOCK=true` でモックデータで動作確認できる。
- モックデータ: `src/lib/mock-data.ts`（アーティスト3名・作品9点・タグ8種）
- データアクセス層: `src/lib/data.ts`（モック / Supabase を切り替え）
- 画像: picsum.photos のプレースホルダーを使用
- 管理画面の認証チェックもスキップされる（読み取りのみ確認可能）

## Supabaseセットアップ手順

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. `.env.local` に以下を設定：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. SQL Editorで `supabase/schema.sql` を実行
4. Storageダッシュボードで `images` バケットを作成（公開設定ON）
5. Authenticationダッシュボードで管理者ユーザーを作成

## 開発サーバー起動

```bash
npm run dev
```

## 主要ページ

| URL | 説明 |
|-----|------|
| `/` | フィード一覧（タグ絞り込み対応） |
| `/artists/:id` | アーティスト詳細 + 作品一覧 |
| `/login` | 管理者ログイン |
| `/admin` | アーティスト管理一覧 |
| `/admin/artists/new` | アーティスト新規登録 |
| `/admin/artists/:id/edit` | アーティスト編集 + 作品追加・削除 |
