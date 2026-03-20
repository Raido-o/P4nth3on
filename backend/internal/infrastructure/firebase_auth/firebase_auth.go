package firebase_auth

import (
	"context"
	"log"

	"P4nth3on-backend/internal/infrastructure/environment"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"
)

type AuthProvider struct {
	env                *environment.Environment
	firebaseAuthClient *auth.Client
}

func NewAuthProvider(env *environment.Environment) *AuthProvider {
	return &AuthProvider{env: env}
}

func (a *AuthProvider) InitFirebase() {
	config := &firebase.Config{
		ProjectID: a.env.FirebaseProjectID,
	}

	var (
		firebaseApp *firebase.App
		err         error
	)

	if a.env.ApplicationEnv == "local" {
		log.Printf("Firebase: Initializing with credentials file for local environment (Project: %s)\n", config.ProjectID)
		opt := option.WithCredentialsFile("firebase-credentials.json")
		firebaseApp, err = firebase.NewApp(context.Background(), config, opt)
	} else {
		log.Printf("Firebase: Initializing with ADC (Project: %s)\n", config.ProjectID)
		firebaseApp, err = firebase.NewApp(context.Background(), config)
	}

	if err != nil {
		log.Fatalf("error initializing Firebase app: %v\n", err)
		return
	}

	firebaseAuthClient, err := firebaseApp.Auth(context.Background())
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
		return
	}

	log.Println("Firebase: Auth client initialized successfully")
	a.firebaseAuthClient = firebaseAuthClient
}

func (a *AuthProvider) GetAuthClient() *auth.Client {
	return a.firebaseAuthClient
}

func (a *AuthProvider) VerifyIDToken(idToken string) (string, error) {
	token, err := a.firebaseAuthClient.VerifyIDToken(context.Background(), idToken)
	if err != nil {
		return "", err
	}
	return token.UID, nil
}
