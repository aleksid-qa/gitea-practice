import { faker } from '@faker-js/faker';

let randomPassword = faker.internet.password({ length: 8 })

export const validRegisterData = {
    username: `${faker.internet.username()}_${Date.now()}`,
    email: `aleksid+${Date.now()}@qamadness.com`,
    password: randomPassword,
    openId_uri: '',
}

export const invalidRegisterData = {
    username: '$test',
    email: 'test',
    emailWithAtSign: 'test@',
    password: faker.internet.password({ length: 7 }),
    nonMatchingPassword: `${randomPassword}1`,
}

export const alreadyRegisteredData = {
    username: 'testuser',
    email: 'test@gmail.com',
    password: 'QA123456&',
}