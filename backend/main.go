package main

import (
	//"context"
	//"fmt"
	"log"
	//"os"
	"net/http"

	"github.com/joho/godotenv"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"

	//"google.golang.org/genai"
)

func main() {
	e := echo.New()
	e.Use(middleware.RequestLogger())

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	/*ctx := context.Background()

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey : os.Getenv("GEMINI_API_KEY"),
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}


	result, err := client.Models.GenerateContent(
        ctx,
        "gemini-3-flash-preview",
        genai.Text("Explain how AI works in a few words"),
        nil,
    )
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(result.Text())*/


	e.GET("/", func(c *echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	if err := e.Start(":1323"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
