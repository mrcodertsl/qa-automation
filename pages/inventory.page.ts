import { Locator, Page } from "@playwright/test";
import { AddItemNameLocatorPairs } from "../constants/inventory.constants";

export class InventoryPage {

    private title: string = "title";
    private inventoryList: string = "inventory-list";
    private inventoryItem: string = "inventory-item";
    private shoppingCartBadge: string = "shopping-cart-badge";
    private shoppingCartLink: string = "shopping-cart-link";

    constructor(private page: Page) {}
    
    public getPageTitle(): Locator {
        return this.page.getByTestId(this.title);
    }

    public getInventoryItems(): Locator {
        return this.page
            .getByTestId(this.inventoryList)
            .getByTestId(this.inventoryItem);
    }

    public async addItemToCart(itemName: string): Promise<void> {
        const addButtonId: string | undefined = AddItemNameLocatorPairs.get(itemName);

        if (!addButtonId) {
            throw new Error(`No add-to-cart locator mapped for item: "${itemName}"`);
        }

        await this.getInventoryItems()
            .filter({ hasText: itemName })
            .getByTestId(addButtonId)
            .click();
    }

    public getShoppingCartBadge(): Locator {
        return this.page.getByTestId(this.shoppingCartBadge);
    }

    public async goToCart(): Promise<void> {
        await this.page.getByTestId(this.shoppingCartLink).click();
    }
}