import { test, expect } from '@playwright/test';
import { getRoomDetailsFromAmenities } from '../../pages/RoomsPage';

import Rooms from '../../Data/room_details.json';
import { RoomDetails} from '../../tests/room-managment-with-fixture/roomDetails';

import { AuthApi } from '../../apis/AuthApi';
import { AdminPage } from '../../pages/AdminPage';
import { Header } from '../../pages/components/Header';
import { RoomApi } from '../../apis/RoomApi';
import { RoomBuildingBlock } from '../../building-blocks/room_building_block';
import { LoginBuildingBlock } from '../../building-blocks/login_building_block';

const roomsDetailsArray: RoomDetails[] = Rooms as any;

test.describe('Room Management Tests', () => {
  let adminPage: AdminPage;
  let header: Header;

  let roomBuildingBlock: RoomBuildingBlock;
  let loginBuildingBlock: LoginBuildingBlock;

  let authApi: AuthApi;
  let roomApi: RoomApi;

  test.beforeEach(async ({ page, request, baseURL }) => {
    loginBuildingBlock = new LoginBuildingBlock(page);

    header = new Header(page);
    roomBuildingBlock = new RoomBuildingBlock(page);
    adminPage = new AdminPage(page);
    authApi = new AuthApi(request);
    roomApi = new RoomApi(request);

    await adminPage.hideCookieBanner(baseURL);
    await adminPage.goto();
    await loginBuildingBlock.login('admin', 'password');
    await expect(header.logoutLink, 'Administrator is logged in').toBeVisible();

    await authApi.login('admin', 'password');
  });

  for (const roomDetails of roomsDetailsArray) {
    test(`User must be able to create new ${roomDetails['room_type']} room named ${roomDetails['room_number']} 
    by filling up all mandatory fields @sanity @management @room-management`, async ({ page }) => {
      const amenities = roomDetails['ammenties'];
      await roomBuildingBlock.createRoom(
        roomDetails.room_number,
        roomDetails.room_type,
        roomDetails.Accesiblity,
        roomDetails.price,
        roomDetails.ammenties
      );

      const accessibleString = roomDetails['Accesiblity'].toString();
      const priceString = roomDetails['price'].toString();
      const amenitiesString = getRoomDetailsFromAmenities(amenities);
      const roomRecord = page.locator(`//div[@data-testid='roomlisting'][.//p[contains(@id,'${roomDetails.room_number}')]]`).last();
      await expect(roomRecord, `Room ${roomDetails.room_number} is not created!`).toBeVisible();
      await expect(roomRecord.locator('p[id*=roomName]'), `Room ${roomDetails.room_number} \n 
        name has correct name: ${roomDetails.room_number}`).toContainText(roomDetails.room_number);
      await expect(roomRecord.locator('p[id*=type]'), `Room ${roomDetails.room_number} \n 
        name has correct type: ${roomDetails.room_type}`).toContainText(roomDetails.room_type);
      await expect(roomRecord.locator('p[id*=accessible]'), `Room ${roomDetails.room_number} has correct accessibility: ${accessibleString}`).toContainText(
        accessibleString
      );
      await expect(roomRecord.locator('p[id*=roomPrice]'), `Room ${roomDetails.room_number} has correct price: ${priceString}`).toContainText(priceString);
      await expect(roomRecord.locator('p[id*=details]'), `Room ${roomDetails.room_number} has correct details: ${amenitiesString}`).toContainText(amenitiesString);
      await roomApi.deleteAllRooms(roomDetails.room_number);
    });
  }
});
