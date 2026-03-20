package integration_test

import (
	"context"
	"fmt"
	"testing"
	"time"

	"P4nth3on-backend/internal/infrastructure/repository"
	"P4nth3on-backend/internal/integration_test/common"
	"P4nth3on-backend/internal/usecase"
	"P4nth3on-backend/internal/usecase/input"
)

func TestUserIntegration_Create(t *testing.T) {
	ctx := context.Background()

	t.Run("ユーザー作成成功", func(t *testing.T) {
		client := common.SetupTestClient(t)
		defer client.Close()

		userRepo := repository.NewUserRepository(client)
		userInteractor := usecase.NewUserInteractor(userRepo)

		userID := fmt.Sprintf("firebase_user_%d", time.Now().UnixNano())
		email := "test@example.com"
		name := "テストユーザー"

		result, err := userInteractor.Create(ctx, &input.CreateUserInput{
			ID:    userID,
			Email: email,
			Name:  name,
		})
		if err != nil {
			t.Fatalf("Create failed: %v", err)
		}

		if result == nil {
			t.Fatal("expected result to be non-nil")
		}
		if result.ID != userID {
			t.Errorf("expected user ID %s, got %s", userID, result.ID)
		}
		if result.Email != email {
			t.Errorf("expected email %s, got %s", email, result.Email)
		}
		if result.Name != name {
			t.Errorf("expected name %s, got %s", name, result.Name)
		}
	})

	t.Run("重複ユーザーIDでエラー", func(t *testing.T) {
		client := common.SetupTestClient(t)
		defer client.Close()

		userRepo := repository.NewUserRepository(client)
		userInteractor := usecase.NewUserInteractor(userRepo)

		userID := fmt.Sprintf("firebase_user_%d", time.Now().UnixNano())

		_, err := userInteractor.Create(ctx, &input.CreateUserInput{
			ID:    userID,
			Email: "first@example.com",
			Name:  "First User",
		})
		if err != nil {
			t.Fatalf("first Create failed: %v", err)
		}

		_, err = userInteractor.Create(ctx, &input.CreateUserInput{
			ID:    userID,
			Email: "second@example.com",
			Name:  "Second User",
		})
		if err == nil {
			t.Error("expected error for duplicate user ID, got nil")
		}
	})
}

func TestUserIntegration_GetMe(t *testing.T) {
	ctx := context.Background()

	t.Run("ユーザー取得成功", func(t *testing.T) {
		client := common.SetupTestClient(t)
		defer client.Close()

		userRepo := repository.NewUserRepository(client)
		userInteractor := usecase.NewUserInteractor(userRepo)

		userID := fmt.Sprintf("firebase_user_%d", time.Now().UnixNano())
		email := "getme@example.com"
		name := "取得テストユーザー"

		_, err := userInteractor.Create(ctx, &input.CreateUserInput{
			ID:    userID,
			Email: email,
			Name:  name,
		})
		if err != nil {
			t.Fatalf("Create failed: %v", err)
		}

		result, err := userInteractor.GetMe(ctx, &input.GetMeInput{ID: userID})
		if err != nil {
			t.Fatalf("GetMe failed: %v", err)
		}

		if result == nil {
			t.Fatal("expected result to be non-nil")
		}
		if result.ID != userID {
			t.Errorf("expected user ID %s, got %s", userID, result.ID)
		}
		if result.Email != email {
			t.Errorf("expected email %s, got %s", email, result.Email)
		}
	})

	t.Run("存在しないユーザーはNotFoundエラー", func(t *testing.T) {
		client := common.SetupTestClient(t)
		defer client.Close()

		userRepo := repository.NewUserRepository(client)
		userInteractor := usecase.NewUserInteractor(userRepo)

		_, err := userInteractor.GetMe(ctx, &input.GetMeInput{
			ID: fmt.Sprintf("nonexistent_%d", time.Now().UnixNano()),
		})
		if err == nil {
			t.Error("expected error for nonexistent user, got nil")
		}
	})
}
