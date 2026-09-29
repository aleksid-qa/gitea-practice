export const RegisterMessages = {
    SUCCESS: 'Account was successfully created. Welcome!',
    EMPTY_FIELD: 'Please fill out this field.',
    EMAIL_TAKEN: 'The email address is already used.',
    EMAIL_INVALID: (email: string) => `Please include an '@' in the email address. '${email}' is missing an '@'.`,
    EMAIL_MISSING_AT_SIGN: (email: string) => `Please enter a part following '@'. '${email}' is incomplete.`,
    USERNAME_TAKEN: 'The username is already taken.',
    USERNAME_INVALID: `Username can only contain alphanumeric characters ('0-9','a-z','A-Z'), dash ('-'), underscore ('_') and dot ('.'). It cannot begin or end with non-alphanumeric characters, and consecutive non-alphanumeric characters are also forbidden.`,
    PASSWORDS_DO_NOT_MATCH: 'The passwords do not match.',
    PASSWORD_TOO_SHORT: 'Password length cannot be less than 8 characters.'
}