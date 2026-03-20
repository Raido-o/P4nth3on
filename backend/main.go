package main

import (
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"

	"google.golang.org/genai"
)

func main() {
	e := echo.New()
	e.Use(middleware.RequestLogger())

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey : apiKey,
		Backend: genai.BackendGeminiAPI,
	})

	model := client.GenerativeModel("gemini-1.5-flash")

	resp, err := model.GenerateContent(ctx, genai.Text("富士山の高さは？"))
	if err != nil {
		log.Fatal(err)
	}

	// 4. レスポンスの解析
	if len(resp.Candidates) > 0 {
		for _, part := range resp.Candidates[0].Content.Parts {
			fmt.Println(part)
		}
	}

	e.GET("/", func(c *echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	if err := e.Start(":1323"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
