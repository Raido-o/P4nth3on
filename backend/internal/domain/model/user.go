package model

import "P4nth3on-backend/internal/domain/model/value"

type User struct {
	id    value.UserId
	email string
	name  string
}

func NewUser(id value.UserId, email string, name string) *User {
	return &User{
		id:    id,
		email: email,
		name:  name,
	}
}

func (u *User) ID() value.UserId {
	return u.id
}

func (u *User) Email() string {
	return u.email
}

func (u *User) Name() string {
	return u.name
}
