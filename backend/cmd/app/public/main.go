package main

import (
	"fmt"
	"log"

	"P4nth3on-backend/internal/presentation/public/router"

	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e, env, client, err := router.NewRouter()
	if err != nil {
		log.Fatalf("could not initialize router: %+v", err)
	}
	defer client.Close()

	e.Use(middleware.CORSWithConfig(
		middleware.CORSConfig{
			AllowOrigins: []string{
				"http://localhost:3000",
			},
			AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "PATCH"},
		},
	))

	log.Printf("Starting server on :%s\n", env.Port)
	if err := e.Start(fmt.Sprintf(":%s", env.Port)); err != nil {
		log.Fatalf("could not start server: %v", err)
	}
}
