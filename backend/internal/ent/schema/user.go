package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").
			NotEmpty().
			Immutable(),
		field.String("name").
			Default("unknown"),
		field.String("email").
			NotEmpty().
			Unique(),
		field.Time("created_at").
			Default(func() time.Time {
				return time.Now().UTC()
			}).
			Immutable(),
		field.Time("updated_at").
			Default(func() time.Time {
				return time.Now().UTC()
			}),
	}
}
