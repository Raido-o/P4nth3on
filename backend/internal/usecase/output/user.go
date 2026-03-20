package output

type UserOutput struct {
	ID    string `validate:"required"`
	Email string `validate:"required"`
	Name  string `validate:"required"`
}

func NewUserOutput(id, email, name string) *UserOutput {
	return &UserOutput{
		ID:    id,
		Email: email,
		Name:  name,
	}
}
