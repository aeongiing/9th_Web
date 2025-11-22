export type UserSigninInformation = {
  email: string;
  password: string;
};

export interface UserSignupInformation {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio?: string;
  avatar?: string;
}

function validateUser(values: { email: string; password: string }) {
  const errors = {
    email: "",
    password: "",
  };

  if (
    !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(
      values.email
    )
  ) {
    errors.email = "올바른 이메일 형식이 아닙니다!";
  }

  if (!(values.password.length >= 8 && values.password.length < 20)) {
    errors.password = "비밀번호는 8~20자 사이로 입력해주세요";
  }

  return errors;
}

function validateSignin(values: UserSigninInformation) {
  return validateUser(values);
}

function validateSignup(
  values: UserSignupInformation
): Record<keyof UserSignupInformation, string> {
  const baseErrors = validateUser(values);

  const errors: Record<keyof UserSignupInformation, string> = {
    name: "",
    email: baseErrors.email,
    password: baseErrors.password,
    confirmPassword: "",
    bio: "",
    avatar: "",
  };

  if (!values.name || values.name.length < 2) {
    errors.name = "이름을 2자 이상 입력해주세요.";
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
  }

  return errors;
}

export { validateSignin, validateSignup, validateUser };