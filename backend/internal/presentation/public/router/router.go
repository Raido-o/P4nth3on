package router

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"P4nth3on-backend/internal/ent"
	"P4nth3on-backend/internal/infrastructure/environment"
	"P4nth3on-backend/internal/infrastructure/firebase_auth"
	"P4nth3on-backend/internal/pkg/cerror"
	"P4nth3on-backend/internal/presentation/public/controller"
	"P4nth3on-backend/internal/presentation/public/router/dependency"
	"P4nth3on-backend/internal/presentation/public/router/middleware"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
)

type Server struct {
	env            *environment.Environment
	userController *controller.UserController
}

func NewServer(
	env *environment.Environment,
	userController *controller.UserController,
) *Server {
	return &Server{
		env:            env,
		userController: userController,
	}
}

func (s *Server) HealthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}

func NewRouter() (*echo.Echo, *environment.Environment, *ent.Client, error) {
	e := echo.New()

	e.HTTPErrorHandler = cerror.CustomHTTPErrorHandler

	logger := middleware.NewLogger()
	e.Use(echoMiddleware.RequestLoggerWithConfig(echoMiddleware.RequestLoggerConfig{
		LogStatus: true,
		LogURI:    true,
		LogValuesFunc: func(c echo.Context, v echoMiddleware.RequestLoggerValues) error {
			logger.Info("request",
				"status", v.Status,
				"uri", v.URI,
			)
			return nil
		},
	}))

	e.Use(echoMiddleware.Recover())

	container := dependency.BuildContainer()
	container.Provide(NewServer)

	var (
		server       *Server
		client       *ent.Client
		authProvider *firebase_auth.AuthProvider
	)

	if err := container.Invoke(func(s *Server) {
		server = s
	}); err != nil {
		return nil, nil, nil, err
	}

	if err := container.Invoke(func(c *ent.Client) {
		client = c
	}); err != nil {
		return nil, nil, nil, err
	}

	if err := container.Invoke(func(a *firebase_auth.AuthProvider) {
		authProvider = a
		authProvider.InitFirebase()
	}); err != nil {
		return nil, nil, nil, err
	}

	e.Use(middleware.FirebaseAuthMiddleware(authProvider.GetAuthClient()))

	e.GET("/health", server.HealthCheck)

	// User routes
	v1 := e.Group("/v1")
	v1.GET("/users/me", server.GetMe)
	v1.POST("/users", server.CreateUser)

	gracefulShutdown(e)

	return e, server.env, client, nil
}

func gracefulShutdown(e *echo.Echo) {
	shutdownCh := make(chan os.Signal, 1)
	signal.Notify(shutdownCh, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		sig := <-shutdownCh
		log.Printf("Received signal %s, shutting down...", sig)

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		if err := e.Shutdown(ctx); err != nil {
			log.Printf("failed to shut down echo server gracefully: %v", err)
			if err := e.Close(); err != nil {
				log.Printf("failed to force close echo server: %v", err)
			}
		}
	}()
}

func (s *Server) startMessage() string {
	return fmt.Sprintf(":%s", s.env.Port)
}
