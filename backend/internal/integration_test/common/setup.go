package common

import (
	"context"
	"testing"

	"P4nth3on-backend/internal/ent"
	"P4nth3on-backend/internal/infrastructure/repository/test"
	"entgo.io/ent/dialect"
	entsql "entgo.io/ent/dialect/sql"
)

// SetupTestClient creates a new test ent client with PostgreSQL testcontainer
func SetupTestClient(t *testing.T) *ent.Client {
	t.Helper()

	ctx := context.Background()

	pgContainer, err := test.NewPostgresContainer(ctx)
	if err != nil {
		t.Fatalf("failed to create postgres container: %v", err)
	}

	t.Cleanup(func() {
		if pgContainer != nil {
			pgContainer.Close(ctx)
		}
	})

	drv := entsql.OpenDB(dialect.Postgres, pgContainer.DB)
	client := ent.NewClient(ent.Driver(drv))

	if err := client.Schema.Create(ctx); err != nil {
		t.Fatalf("failed to create schema: %v", err)
	}

	return client
}
