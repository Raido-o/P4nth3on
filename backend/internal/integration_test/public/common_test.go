package public

import (
	"context"
	"log"
	"net/http"
	"os"
	"testing"

	"P4nth3on-backend/internal/ent"
	"P4nth3on-backend/internal/infrastructure/repository"
	"P4nth3on-backend/internal/infrastructure/repository/test"
	"P4nth3on-backend/internal/pkg/cerror"
	"P4nth3on-backend/internal/presentation/public/controller"
	"P4nth3on-backend/internal/presentation/public/presenter"
	"P4nth3on-backend/internal/presentation/public/router/context_keys"
	"P4nth3on-backend/internal/usecase"

	"entgo.io/ent/dialect"
	entsql "entgo.io/ent/dialect/sql"
	"github.com/labstack/echo/v4"
)

const (
	testUIDHeader   = "X-Test-UID"
	testEmailHeader = "X-Test-Email"
)

var (
	pgContainer *test.PostgresContainer
	echoServer  *echo.Echo
)

func TestMain(m *testing.M) {
	ctx := context.Background()

	var err error
	pgContainer, err = test.NewPostgresContainer(ctx)
	if err != nil {
		log.Fatalf("failed to create postgres container: %v", err)
	}

	drv := entsql.OpenDB(dialect.Postgres, pgContainer.DB)
	client := ent.NewClient(ent.Driver(drv))

	if err := client.Schema.Create(ctx); err != nil {
		log.Fatalf("failed to create schema: %v", err)
	}

	// Dependency setup
	userRepo := repository.NewUserRepository(client)
	userUsecase := usecase.NewUserInteractor(userRepo)
	userPresenter := presenter.NewUserPresenter()
	userCtrl := controller.NewUserController(userUsecase, userPresenter)

	// テスト用認証ミドルウェア（X-Test-UIDヘッダーからuidをセット）
	testAuthMiddleware := func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			uid := c.Request().Header.Get(testUIDHeader)
			email := c.Request().Header.Get(testEmailHeader)
			if uid != "" {
				c.Set(context_keys.UserIDContextKey, uid)
			}
			if email != "" {
				c.Set(context_keys.UserEmailContextKey, email)
			}
			return next(c)
		}
	}

	// Build echo server
	echoServer = echo.New()
	echoServer.HTTPErrorHandler = cerror.CustomHTTPErrorHandler
	echoServer.Use(testAuthMiddleware)

	echoServer.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
	})
	echoServer.POST("/v1/users", func(c echo.Context) error {
		return userCtrl.Create(c)
	})
	echoServer.GET("/v1/users/me", func(c echo.Context) error {
		return userCtrl.GetMe(c)
	})

	code := m.Run()

	if err := pgContainer.Close(ctx); err != nil {
		log.Printf("failed to close test container: %v", err)
	}

	os.Exit(code)
}
