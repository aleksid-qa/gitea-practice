export const Urls = {
    REGISTER_PAGE: '/user/sign_up',
    LOGIN_PAGE: '/user/login',
    REPOSITORIES_PAGE: '/explore/repos',
    CREATE_NEW_REPOSITORY_PAGE: '/repo/create',
    REPOSITORY_PAGE: (username: string, repository: string) => `/${username}/${repository}`,
}