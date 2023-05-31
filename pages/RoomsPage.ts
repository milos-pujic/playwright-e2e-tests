import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RoomsPage extends BasePage {
  readonly roomNameField: Locator;
  readonly roomTypeSelect: Locator;
  readonly roomAccessibleSelect: Locator;
  readonly roomPriceField: Locator;
  readonly wifiCheckbox: Locator;
  readonly tvCheckbox: Locator;
  readonly radioCheckbox: Locator;
  readonly refreshmentsCheckbox: Locator;
  readonly safeCheckbox: Locator;
  readonly viewsCheckbox: Locator;
  readonly createRoomButton: Locator;
  readonly contactErrorMessages: Locator;

  constructor(page: Page) {
    super(page);
    this.roomNameField = page.getByTestId('roomName');
    this.roomTypeSelect = page.locator('#type');
    this.roomAccessibleSelect = page.locator('#accessible');
    this.roomPriceField = page.locator('#roomPrice');
    this.wifiCheckbox = page.getByLabel('WiFi');
    this.tvCheckbox = page.getByLabel('TV');
    this.radioCheckbox = page.getByLabel('Radio');
    this.refreshmentsCheckbox = page.getByLabel('Refreshments');
    this.safeCheckbox = page.getByLabel('Safe');
    this.viewsCheckbox = page.getByLabel('Views');
    this.createRoomButton = page.getByRole('button', { name: 'Create' });
    this.contactErrorMessages = page.locator('.alert.alert-danger');
  }

  async goto() {
    await this.page.goto('/#/admin');
  }

  async createRoom(name: string, type: RoomType | null, accessible: boolean, price: number | null, amenities: RoomAmenities) {
    if (name) await this.roomNameField.type(name);
    if (type != null && type) await this.roomTypeSelect.selectOption(type);
    if (accessible) await this.roomAccessibleSelect.selectOption('true');
    else await this.roomAccessibleSelect.selectOption('false');
    if (price != null && price) await this.roomPriceField.type(price.toString());
    if (amenities.wifi) await this.wifiCheckbox.check();
    else await this.wifiCheckbox.uncheck();
    if (amenities.tv) await this.tvCheckbox.check();
    else await this.tvCheckbox.uncheck();
    if (amenities.radio) await this.radioCheckbox.check();
    else await this.radioCheckbox.uncheck();
    if (amenities.refreshments) await this.refreshmentsCheckbox.check();
    else await this.refreshmentsCheckbox.uncheck();
    if (amenities.safe) await this.safeCheckbox.check();
    else await this.safeCheckbox.uncheck();
    if (amenities.views) await this.viewsCheckbox.check();
    else await this.viewsCheckbox.uncheck();
    await this.createRoomButton.click();
  }
}

export enum RoomType {
  SINGLE = 'Single',
  TWIN = 'Twin',
  DOUBLE = 'Double',
  FAMILY = 'Family',
  SUITE = 'Suite'
}

export type RoomAmenities = {
  wifi: boolean;
  tv: boolean;
  radio: boolean;
  refreshments: boolean;
  safe: boolean;
  views: boolean;
};

export function getAmenitiesAsList(roomAmenities: RoomAmenities) {
  const amenities: string[] = [];
  if (roomAmenities.wifi) amenities.push('WiFi');
  if (roomAmenities.tv) amenities.push('TV');
  if (roomAmenities.radio) amenities.push('Radio');
  if (roomAmenities.refreshments) amenities.push('Refreshments');
  if (roomAmenities.safe) amenities.push('Safe');
  if (roomAmenities.views) amenities.push('Views');
  return amenities;
}

export function getRoomDetailsFromAmenities(roomAmenities: RoomAmenities) {
  const amenities: string[] = getAmenitiesAsList(roomAmenities);
  return amenities.length == 0 ? 'No features added to the room' : amenities.join(', ');
}
