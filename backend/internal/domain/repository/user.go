package repository

import (
	"context"

	"P4nth3on-backend/internal/domain/model"
)

type IUserRepository interface {
	GetByID(ctx context.Context, id string) (*model.User, error)
	Create(ctx context.Context, query *CreateUserQuery) error
}

type CreateUserQuery struct {
	User *model.User
}
