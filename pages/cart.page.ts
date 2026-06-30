import { Locator, Page } from "@playwright/test";
import { RemoveItemNameLocatorPairs } from "../constants/inventory.constants";

export class CartPage {

    private cartList: string = "cart-list";
    private cartInventoryItemName: string = "inventory-item-name"; 
    private shoppingCartBadge: string = "shopping-cart-badge";
    private continueShopping: string = "continue-shopping";

    constructor(private page: Page) {}

    public getInventoryItems(): Locator {
        return this.page
            .getByTestId(this.cartList)
            .getByTestId(this.cartInventoryItemName);
    }

    public checkSpecificItemIsAdded(itemName: string): Locator {
        return this.getInventoryItems()
            .filter({ hasText: itemName });
    }

    public async removeInventoryItemFromTheCart(itemName: string): Promise<void> {
        const removeButtonId: string | undefined = RemoveItemNameLocatorPairs.get(itemName);

        if (!removeButtonId) {
            throw new Error(`No remove-from-cart locator mapped for item: "${itemName}"`);
        }

        await this.page.getByTestId(removeButtonId).click();
    }

    public getShoppingCartBadge(): Locator {
        return this.page.getByTestId(this.shoppingCartBadge);
    }

    public async goToInventoriesPage(): Promise<void> {
        await this.page.getByTestId(this.continueShopping).click();
    }
}