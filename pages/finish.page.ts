import { Locator, Page } from "@playwright/test";

export class FinishPage {

    private completeHeader: string = "complete-header";

    constructor(private page: Page) {}

    public getCompleteHeaderMessage(): Locator {
        return this.page.getByTestId(this.completeHeader);
    }
}