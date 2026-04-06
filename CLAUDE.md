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
| デプロイ先 | Vercel（Supabase 本番接続済み） |

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

## 現在の実装状態（2026-04-06時点）

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
- Vercel デプロイ・Supabase 本番接続済み

### 未着手（次回以降）
- 動作確認・デバッグ（ログイン・アーティスト登録・画像アップロード）
- お気に入り機能の本実装（DBスキーマのみ定義済み）

## モック開発モード

`.env.local` の `NEXT_PUBLIC_USE_MOCK=true` でモックデータで動作確認できる。
- モックデータ: `src/lib/mock-data.ts`（アーティスト3名・作品9点・タグ8種）
- データアクセス層: `src/lib/data.ts`（モック / Supabase を切り替え）
- 画像: picsum.photos のプレースホルダーを使用
- 管理画面の認証チェックもスキップされる（読み取りのみ確認可能）

## Supabase 設定情報

- **Project URL**: `https://ithbwbohycwslkrpfwid.supabase.co`
- **管理者アカウント**: `n.ohtani@rissei.jp`

### 適用済み設定
- DBスキーマ（`supabase/schema.sql`）を SQL Editor で実行済み
- `images` バケット作成済み（公開設定ON）
- Storage RLS ポリシー設定済み：
  - `images_public_read`：全ユーザー閲覧可
  - `images_auth_upload`：認証済みユーザーのみアップロード可
  - `images_auth_delete`：認証済みユーザーのみ削除可

### 環境変数
`.env.local`（ローカル）および Vercel の環境変数に以下を設定済み：

| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_USE_MOCK` | `false`（本番接続モード） |

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
