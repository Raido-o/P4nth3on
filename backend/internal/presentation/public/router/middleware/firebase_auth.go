package middleware

import (
	"context"
	"net/http"
	"strings"

	"P4nth3on-backend/internal/presentation/public/router/context_keys"
	"firebase.google.com/go/v4/auth"
	"github.com/labstack/echo/v4"
)

var publicRoutes = []string{
	"/health",
}

// FirebaseAuthMiddleware validates Firebase ID tokens and sets user ID in context
func FirebaseAuthMiddleware(authClient *auth.Client) echo.MiddlewareFunc {
	publicRoutesMap := make(map[string]bool)
	for _, route := range publicRoutes {
		publicRoutesMap[route] = true
	}

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if c.Request().Method == http.MethodOptions {
				return next(c)
			}

			if publicRoutesMap[c.Request().URL.Path] {
				return next(c)
			}

			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return echo.NewHTTPError(http.StatusUnauthorized, "missing authorization header")
			}

			token := strings.TrimPrefix(authHeader, "Bearer ")
			if token == authHeader {
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid authorization header format")
			}

			idToken, err := authClient.VerifyIDToken(context.Background(), token)
			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid token")
			}

			c.Set(context_keys.UserIDContextKey, idToken.UID)

			if email, ok := idToken.Claims["email"].(string); ok {
				c.Set(context_keys.UserEmailContextKey, email)
			}

			return next(c)
		}
	}
}
