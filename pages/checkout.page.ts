import { Locator, Page } from "@playwright/test";

export class CheckoutPage {

    private checkout: string = "checkout";
    private checkoutInfo: string = ".checkout_info";
    private firstName: string = "firstName";
    private lastName: string = "lastName";
    private postalCode: string = "postalCode";
    private continueBtn: string = "continue";
    private fillInDataError: string = "error";
    private cart: string = "cart-list";
    private cartItemName: string = "inventory-item-name";
    private itemsTotalPrice: string = "subtotal-label";
    private tax: string = "tax-label";
    private totalPrice: string = "total-label";
    private finishBtn: string = "finish";
    private cancelBtn: string = "cancel";

    constructor(private page: Page) {}

    public async goToCheckout(): Promise<void> {
        const checkoutBtn = this.page.getByTestId(this.checkout);
        await checkoutBtn.click();
    }

    public getCheckoutForm(): Locator {
        return this.page.locator(this.checkoutInfo);
    }

    public async fillInCheckoutForm(firstName: string, lastName: string, postalCode: string) {
        await this.page.getByTestId(this.firstName).fill(firstName);
        await this.page.getByTestId(this.lastName).fill(lastName);
        await this.page.getByTestId(this.postalCode).fill(postalCode);
    }

    public async pressContinue(): Promise<void> {
        await this.page.getByTestId(this.continueBtn).click();
    }

    public continueErrorBanner(): Locator {
        return this.page.getByTestId(this.fillInDataError);
    }

    public getAddedItems(): Locator {
        return this.page.getByTestId(this.cart).getByTestId(this.cartItemName);
    }

    public async getVisibleItemsTotalPrice(): Promise<number> {
        const itemsTotalPriceString: string = await this.page.getByTestId(this.itemsTotalPrice).innerText();
        const itemsTotalPriceValue = parseFloat(itemsTotalPriceString.split("$")[1] ?? "0");
        return itemsTotalPriceValue;
    }

    public calculateExpectedItemsTotalPrice(itemPrices: string[]): number {
        return itemPrices
            .map(ip => parseFloat(ip))
            .reduce((acc, ip) => {
                acc += ip;
                return acc;
            }, 0);
    }

    public async getTax(): Promise<number> {
        const taxString = await this.page.getByTestId(this.tax).innerText(); 
        return parseFloat(taxString.split("$")[1] ?? "0");
    }

    public async getTotalPrice(): Promise<number> {
        const totalPriceString = await this.page.getByTestId(this.totalPrice).innerText(); 
        return parseFloat(totalPriceString.split("$")[1] ?? "0");
    }

    public async goToFinishPage(): Promise<void> {
        return await this.page.getByTestId(this.finishBtn).click();
    }

    public async goToCart(): Promise<void> {
        return await this.page.getByTestId(this.cancelBtn).click();
    }
}