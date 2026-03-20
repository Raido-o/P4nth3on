package dependency

import (
	"P4nth3on-backend/internal/infrastructure/database"
	"P4nth3on-backend/internal/infrastructure/environment"
	"P4nth3on-backend/internal/infrastructure/firebase_auth"
	"P4nth3on-backend/internal/infrastructure/repository"
	"P4nth3on-backend/internal/presentation/public/controller"
	"P4nth3on-backend/internal/presentation/public/presenter"
	"P4nth3on-backend/internal/usecase"
	"go.uber.org/dig"
)

func BuildContainer() *dig.Container {
	container := dig.New()

	// environment
	container.Provide(environment.NewEnvironment)

	// infrastructure
	container.Provide(database.NewDB)

	// firebase auth
	container.Provide(firebase_auth.NewAuthProvider)

	// presenter
	container.Provide(presenter.NewUserPresenter)

	// controller
	container.Provide(controller.NewUserController)

	// usecase
	container.Provide(usecase.NewUserInteractor)

	// repository
	container.Provide(repository.NewUserRepository)

	return container
}
