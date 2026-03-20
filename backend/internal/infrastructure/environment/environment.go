package environment

import (
	env "github.com/caarlos0/env/v11"
)

type Environment struct {
	Port              string `env:"PORT" envDefault:"8080"`
	ApplicationEnv    string `env:"APP_ENV" envDefault:"local"`
	FirebaseProjectID string `env:"FIREBASE_PROJECT_ID" envDefault:"p4nth3on"`
	DatabaseEnvironment
}

type DatabaseEnvironment struct {
	PostgresHost     string `env:"POSTGRES_DB_HOST" envDefault:"localhost"`
	PostgresPort     string `env:"POSTGRES_DB_PORT" envDefault:"5432"`
	PostgresUser     string `env:"POSTGRES_DB_USER" envDefault:"postgres"`
	PostgresPassword string `env:"POSTGRES_DB_PASSWORD" envDefault:"password"`
	PostgresDB       string `env:"POSTGRES_DB_NAME" envDefault:"postgres"`
}

func NewEnvironment() *Environment {
	e := &Environment{}
	if err := env.Parse(e); err != nil {
		panic(err)
	}
	return e
}
