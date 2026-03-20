.PHONY: help run dev build test tidy generate_ent generate_api migrate_up migrate_diff docker_up docker_down lint

# デフォルトターゲット
help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  run              ローカルでサーバーを起動"
	@echo "  dev              airでホットリロード起動"
	@echo "  build            バイナリをビルド"
	@echo "  test             テストを実行"
	@echo "  tidy             go mod tidy"
	@echo "  generate_ent     entのコード生成"
	@echo "  generate_api     OpenAPI定義からAPIコードを生成"
	@echo "  migrate_up       マイグレーションを実行（auto-migrate）"
	@echo "  migrate_diff     atlasでマイグレーションファイルを生成"
	@echo "  docker_up        Docker Composeを起動"
	@echo "  docker_down      Docker Composeを停止"
	@echo "  lint             golangci-lintを実行"

# ローカル起動
run:
	go run ./cmd/app/public/main.go

# airでホットリロード
dev:
	air -c .air.toml

# ビルド
build:
	go build -o ./bin/main ./cmd/app/public/main.go

# テスト
test:
	go test ./...

# go mod tidy
tidy:
	go mod tidy

# entコード生成
generate_ent:
	go generate ./internal/ent/...

# OpenAPI定義からAPIコードを生成
generate_api:
	oapi-codegen \
		--package=api \
		--generate=types,echo-server,spec \
		--o ./internal/presentation/public/api/api.go \
		./openapi/openapi-public.yaml

# DB マイグレーション (ent の auto-migrate)
migrate_up:
	go run ./cmd/migrate/main.go

# atlas でマイグレーション差分生成
migrate_diff:
	atlas migrate diff \
		--dir "file://migrations" \
		--to "ent://internal/ent/schema" \
		--dev-url "postgres://atlas:atlas@localhost:5433/dev?sslmode=disable"

# Docker Compose 起動
docker_up:
	docker compose up -d

# Docker Compose 停止
docker_down:
	docker compose down

# lint
lint:
	golangci-lint run ./...
