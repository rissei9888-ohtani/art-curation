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
| デプロイ先 | Vercel（予定） |

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
