package input

type CreateUserInput struct {
	ID    string `validate:"required"`
	Email string `validate:"required"`
	Name  string `validate:"required"`
}

type GetMeInput struct {
	ID string `validate:"required"`
}
