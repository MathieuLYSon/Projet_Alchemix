import React, { useState, useContext } from 'react';
// import {Link, Navigate} from "react-router-dom";

// import Card from '../../shared/components/UIElements/Card';
// import Users from './Users';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
// import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          // image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          },
          // image: {
          //   value: null,
          //   isValid: false
          // }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        // formData.append('image', formState.inputs.image.value);
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/signup',
          'POST',
          formData
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
        {isLoading && <LoadingSpinner asOverlay />}
        <div className='spacer'></div>
        <div className='auth_container'>
          <h2>Connectez-vous à Alchemix</h2>
          <hr></hr>
          <form onSubmit={authSubmitHandler} className='auth_container-form'>
            {/* {!isLoginMode && (
              <ImageUpload
                center
                id="image"
                onInput={inputHandler}
              />
            )} */}
            {!isLoginMode && (
              <Input
                element="input"
                id="name"
                type="text"
                label="Surnom"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Veuillez entrez votre Nom."
                onInput={inputHandler}
              />
            )}
            <Input
              element="input"
              id="email"
              type="email"
              label="E-Mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Veuillez entrez une adresse mail valide."
              onInput={inputHandler}
            />
            <Input
              element="input"
              id="password"
              type="password"
              label="Mot de passe"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Veuillez saisir un mot de passe valide, au moins 6 caractères."
              onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
              {isLoginMode ? "Se connecter" : "S'inscrire"}
            </Button>
          </form>
          <hr></hr>
          {isLoginMode ? <h3>Vous n'avez pas de compte ?</h3> : <h3>Vous avez déjà un compte ?</h3>}
          <Button inverse onClick={switchModeHandler}>
            {isLoginMode ? "S'inscrire" : "Se connecter"}
          </Button>
        </div>
    </React.Fragment>
  );
};

export default Auth;
