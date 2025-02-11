# AIアシスタントガイドライン <!-- omit from toc -->

このドキュメントは、AIアシスタントに対する指示や設定をまとめたものです。
各セクションの内容は、AIアシスタントへのプロンプトとして使用することを想定しています。

## Table of Contents <!-- omit from toc -->
- [Git](#git)
  - [When committing](#when-committing)
    - [Message format](#message-format)
    - [Message examples](#message-examples)
    - [Command examples](#command-examples)
    - [Message rules](#message-rules)

## Git

### When committing

#### Message format
```
(?:[emoji-prefix]) [overview-message]

Created with AI ([Model Name]) in [Platform Name]

[detailed-messages]
```

#### Message examples
```
:hammer_and_wrench: Fix type errors in `/script/plopfile.ts`

Created with AI (Claude 3.5 Sonnet) in Cursor
```

```
Ensure `Wve#partial()` infers undefineable type when the target is a record

Created with AI (Claude 3.5 Sonnet) in Cursor
```

```
Add note kind editing feature

Created with AI (Claude 3.5 Sonnet) in Cursor

- Add `<EditNote/>` component for note editing functionality
- Implement note kind selection with visual feedback
- Add lane selection for note placement
```

#### Command examples
```bash
mkdir -p .temp
# 4行目以降に余分な空行を含めないよう、`git commit -F` を使用する
echo -e "improve note kind visualization\n\nCreated with AI (Claude 3.5 Sonnet) in Cursor\n\n- Use mask-image for note kind icons\n- Improve keyframe positioning in timeline\n- Adjust icon sizes and styles" > .temp/commit-message.txt && git commit -F .temp/commit-message.txt && rm .temp/commit-message.txt
```

#### Message rules
- 英文で記述する
- もし .gitmessage に妥当な emoji-prefix が定義されていれば、1行目の先頭に付与する
- 複数の emoji-prefix は使用しないこと
- emoji-prefix は :emoji: の形式で使用すること
- 1行目は可能であれば簡潔に納める
- 2行目に空行を入れる
- 3行目は "Created with AI ([Model Name]) in [Platform Name]" の形式で記述する
  例： Created with AI (Claude 3.5 Sonnet) in Cursor
- 4行目以降は必要なら、変更についての詳細や備考などを追記する
- 4行目以降は自明なら省略してよい
- 技術的な単語は正確に記述すること
- コミットメッセージの日本語訳をプロンプト内でのみ表示すること
- コミットメッセージ本体には日本語を含めないこと
