// ERROR para intentos de ingreso NoSQL-injection attempt.

export default class AuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
    this.statusCode = 401;
  }
}
