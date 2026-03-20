package value

type UserId string

func UserIdFromString(id string) UserId {
	return UserId(id)
}

func (u UserId) String() string {
	return string(u)
}
