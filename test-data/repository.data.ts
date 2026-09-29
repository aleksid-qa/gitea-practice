import { faker } from '@faker-js/faker';

export const validRepositoryData = {
    repositoryName: `${faker.internet.username()}_${Date.now()}`,
}

export const existingRepositoryData = {
    repositoryName: 'testRepository',
}