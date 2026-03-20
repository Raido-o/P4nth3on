package database

import (
	"fmt"
	"log"
	"time"

	"P4nth3on-backend/internal/ent"
	"P4nth3on-backend/internal/infrastructure/environment"

	"entgo.io/ent/dialect"
	entsql "entgo.io/ent/dialect/sql"
	_ "github.com/lib/pq"
)

func NewDB(e *environment.Environment) (*ent.Client, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		e.DatabaseEnvironment.PostgresHost,
		e.DatabaseEnvironment.PostgresPort,
		e.DatabaseEnvironment.PostgresUser,
		e.DatabaseEnvironment.PostgresPassword,
		e.DatabaseEnvironment.PostgresDB,
	)

	log.Println("postgres: connecting...")

	drv, err := entsql.Open(dialect.Postgres, dsn)
	if err != nil {
		return nil, err
	}

	db := drv.DB()
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	maxRetries := 5
	retryDelay := 2 * time.Second

	for i := range maxRetries {
		if err := db.Ping(); err == nil {
			log.Println("postgres: connected successfully")
			break
		} else {
			if i == maxRetries-1 {
				log.Printf("postgres: failed to connect after %d attempts: %v", maxRetries, err)
				return nil, err
			}
			log.Printf("postgres: connection attempt %d failed, retrying in %v...", i+1, retryDelay)
			time.Sleep(retryDelay)
		}
	}

	return ent.NewClient(ent.Driver(drv)), nil
}
