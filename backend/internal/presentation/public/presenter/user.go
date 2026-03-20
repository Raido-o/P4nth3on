package presenter

import (
	"net/http"

	"P4nth3on-backend/internal/usecase/output"
	"github.com/labstack/echo/v4"
)

type IUserPresenter interface {
	GetMe(ctx echo.Context, out *output.UserOutput) error
	Create(ctx echo.Context, out *output.UserOutput) error
}

type UserPresenter struct{}

func NewUserPresenter() IUserPresenter {
	return &UserPresenter{}
}

func (p *UserPresenter) GetMe(ctx echo.Context, out *output.UserOutput) error {
	return ctx.JSON(http.StatusOK, map[string]any{
		"id":    out.ID,
		"email": out.Email,
		"name":  out.Name,
	})
}

func (p *UserPresenter) Create(ctx echo.Context, out *output.UserOutput) error {
	return ctx.JSON(http.StatusCreated, map[string]any{
		"id":    out.ID,
		"email": out.Email,
		"name":  out.Name,
	})
}
