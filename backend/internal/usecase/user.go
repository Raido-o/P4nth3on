package usecase

import (
	"context"

	"P4nth3on-backend/internal/domain/model"
	"P4nth3on-backend/internal/domain/model/value"
	"P4nth3on-backend/internal/domain/repository"
	"P4nth3on-backend/internal/pkg/cerror"
	"P4nth3on-backend/internal/usecase/input"
	"P4nth3on-backend/internal/usecase/output"
)

type IUserInteractor interface {
	GetMe(ctx context.Context, param *input.GetMeInput) (*output.UserOutput, error)
	Create(ctx context.Context, param *input.CreateUserInput) (*output.UserOutput, error)
}

type UserInteractor struct {
	userRepository repository.IUserRepository
}

func NewUserInteractor(userRepository repository.IUserRepository) IUserInteractor {
	return &UserInteractor{
		userRepository: userRepository,
	}
}

func (ui *UserInteractor) GetMe(ctx context.Context, param *input.GetMeInput) (*output.UserOutput, error) {
	user, err := ui.userRepository.GetByID(ctx, param.ID)
	if err != nil {
		if cerror.Is(err, cerror.NoRows) {
			return nil, cerror.Wrap(err, "user not found",
				cerror.WithNotFoundCode(),
				cerror.WithClientMsg("ユーザーが見つかりません"),
			)
		}
		return nil, cerror.Wrap(err, "failed to get user",
			cerror.WithInternalCode(),
			cerror.WithClientMsg("ユーザー情報の取得に失敗しました"),
		)
	}

	return output.NewUserOutput(user.ID().String(), user.Email(), user.Name()), nil
}

func (ui *UserInteractor) Create(ctx context.Context, param *input.CreateUserInput) (*output.UserOutput, error) {
	userModel := model.NewUser(value.UserIdFromString(param.ID), param.Email, param.Name)

	err := ui.userRepository.Create(ctx, &repository.CreateUserQuery{
		User: userModel,
	})
	if err != nil {
		if cerror.Is(err, cerror.AlreadyExists) {
			return nil, cerror.Wrap(err, "user already exists",
				cerror.WithAlreadyExistsCode(),
				cerror.WithClientMsg("このユーザーは既に登録されています"),
			)
		}
		return nil, cerror.Wrap(err, "failed to create user",
			cerror.WithInternalCode(),
			cerror.WithClientMsg("ユーザーの作成に失敗しました"),
		)
	}

	createdUser, err := ui.userRepository.GetByID(ctx, param.ID)
	if err != nil {
		return nil, cerror.Wrap(err, "failed to get created user",
			cerror.WithInternalCode(),
			cerror.WithClientMsg("ユーザーの作成に失敗しました"),
		)
	}

	return output.NewUserOutput(createdUser.ID().String(), createdUser.Email(), createdUser.Name()), nil
}
