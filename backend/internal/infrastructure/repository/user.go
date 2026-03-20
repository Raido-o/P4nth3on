package repository

import (
	"context"

	"P4nth3on-backend/internal/domain/model"
	"P4nth3on-backend/internal/domain/model/value"
	"P4nth3on-backend/internal/domain/repository"
	"P4nth3on-backend/internal/ent"
	entuser "P4nth3on-backend/internal/ent/user"
	"P4nth3on-backend/internal/pkg/cerror"
)

type UserRepository struct {
	client *ent.Client
}

func NewUserRepository(client *ent.Client) repository.IUserRepository {
	return &UserRepository{client: client}
}

func (r *UserRepository) GetByID(ctx context.Context, id string) (*model.User, error) {
	entUser, err := r.client.User.
		Query().
		Where(entuser.IDEQ(id)).
		Only(ctx)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, cerror.Wrap(err, "user not found",
				cerror.WithNoRowsCode(),
			)
		}
		return nil, cerror.Wrap(err, "failed to query user from database",
			cerror.WithPostgreSQLCode(),
		)
	}

	return model.NewUser(
		value.UserIdFromString(entUser.ID),
		entUser.Email,
		entUser.Name,
	), nil
}

func (r *UserRepository) Create(ctx context.Context, query *repository.CreateUserQuery) error {
	user := query.User

	_, err := r.client.User.
		Create().
		SetID(user.ID().String()).
		SetEmail(user.Email()).
		SetName(user.Name()).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return cerror.Wrap(err, "user already exists",
				cerror.WithAlreadyExistsCode(),
			)
		}
		return cerror.Wrap(err, "failed to create user in database",
			cerror.WithPostgreSQLCode(),
		)
	}

	return nil
}
