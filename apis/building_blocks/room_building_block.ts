import { Page } from '@playwright/test';
import { RoomsPage } from '../../pages/RoomsPage';
import {RoomType} from '../../pages/RoomsPage';
import {RoomAmenities} from '../../pages/RoomsPage';

export class RoomBuildingBlock{
  readonly page: Page;
  readonly roomPage: RoomsPage;
  
  constructor(page: Page, roomPage: RoomsPage) {
    this.page = page;
    this.roomPage = roomPage;
  }

  async createRoom(roomName: string, roomType: RoomType | null, roomIsAccessible: boolean, roomPrice: number | null, roomAmenities: RoomAmenities) {
    
      await this.roomPage.roomNameField.type(roomName);
      await this.roomPage.selectRoomType(roomType);
      await this.roomPage.roomAccessibleSelect.selectOption(roomIsAccessible ? 'true' : 'false');
      await this.roomPage.enterPrice(roomPrice);
      await this.roomPage.selectAmenities(roomAmenities);
      await this.roomPage.createRoomButton.click();
    
  }

}
