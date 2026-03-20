package controller

import (
	"P4nth3on-backend/internal/pkg/cerror"
	"P4nth3on-backend/internal/presentation/public/presenter"
	"P4nth3on-backend/internal/presentation/public/router/context_keys"
	"P4nth3on-backend/internal/usecase"
	"P4nth3on-backend/internal/usecase/input"

	"github.com/labstack/echo/v4"
)

type UserController struct {
	userUsecase   usecase.IUserInteractor
	userPresenter presenter.IUserPresenter
}

func NewUserController(
	userUsecase usecase.IUserInteractor,
	userPresenter presenter.IUserPresenter,
) *UserController {
	return &UserController{
		userUsecase:   userUsecase,
		userPresenter: userPresenter,
	}
}

func (uc *UserController) GetMe(ctx echo.Context) error {
	userID, ok := ctx.Get(context_keys.UserIDContextKey).(string)
	if !ok || userID == "" {
		return cerror.New("user ID is required",
			cerror.WithUnauthorizedCode(),
			cerror.WithClientMsg("ユーザー認証が必要です"),
		)
	}

	user, err := uc.userUsecase.GetMe(ctx.Request().Context(), &input.GetMeInput{
		ID: userID,
	})
	if err != nil {
		return err
	}

	return uc.userPresenter.GetMe(ctx, user)
}

func (uc *UserController) Create(ctx echo.Context) error {
	userID, ok := ctx.Get(context_keys.UserIDContextKey).(string)
	if !ok || userID == "" {
		return cerror.New("user ID is required",
			cerror.WithUnauthorizedCode(),
			cerror.WithClientMsg("ユーザー認証が必要です"),
		)
	}

	userEmail, ok := ctx.Get(context_keys.UserEmailContextKey).(string)
	if !ok || userEmail == "" {
		return cerror.New("user email is required",
			cerror.WithUnauthorizedCode(),
			cerror.WithClientMsg("メールアドレスの取得に失敗しました"),
		)
	}

	var req struct {
		Name string `json:"name"`
	}
	if err := ctx.Bind(&req); err != nil {
		return cerror.Wrap(err, "failed to bind request",
			cerror.WithInvalidArgumentCode(),
			cerror.WithClientMsg("リクエストの形式が正しくありません"),
		)
	}

	user, err := uc.userUsecase.Create(ctx.Request().Context(), &input.CreateUserInput{
		ID:    userID,
		Email: userEmail,
		Name:  req.Name,
	})
	if err != nil {
		return err
	}

	return uc.userPresenter.Create(ctx, user)
}
