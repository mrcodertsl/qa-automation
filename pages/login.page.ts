import { Locator, Page } from "@playwright/test";
import { config } from "../config/env";

export class LoginPage {

    private loginFld: string = "username";
    private passwordFld: string = "password";
    private loginBtn: string = "login-button";
    private errorMsg: string = "error";

    constructor(private page: Page) {}

    public async login(login: string, password: string) {
        await this.page.goto(config.baseURL);

        await this.page.getByTestId(this.loginFld).fill(login);
        await this.page.getByTestId(this.passwordFld).fill(password);

        await this.page.getByTestId(this.loginBtn).click();
    }

    public getErrorBanner(): Locator {
        return this.page.getByTestId(this.errorMsg);
    }

}