import { test, expect } from '@playwright/test';
import { RoomsPage, RoomAmenities, getRoomDetailsFromAmenities, RoomType } from '../../pages/RoomsPage';
import { AuthApi } from '../../apis/AuthApi';
import { AdminPage } from '../../pages/AdminPage';
import { Header } from '../../pages/components/Header';
import { RoomApi } from '../../apis/RoomApi';
import { RoomBuildingBlock } from '../../building-blocks/room_building_block';
import { LoginBuildingBlock } from '../../building-blocks/login_building_block';

test.describe('Room Management Tests', () => {
  let adminPage: AdminPage;
  let header: Header;
  let roomsPage: RoomsPage;
  
  let roomBuildingBlock: RoomBuildingBlock;
  let loginBuildingBlock: LoginBuildingBlock;

  let authApi: AuthApi;
  let roomApi: RoomApi;

  test.beforeEach(async ({ page, request, baseURL }) => {
    adminPage = new AdminPage(page);
    loginBuildingBlock=new LoginBuildingBlock(page,adminPage);

    header = new Header(page);
    roomsPage = new RoomsPage(page);
    roomBuildingBlock = new RoomBuildingBlock(page,roomsPage);
     
    authApi = new AuthApi(request);
    roomApi = new RoomApi(request);

    await adminPage.hideCookieBanner(baseURL);
    await adminPage.goto();
    await loginBuildingBlock.login('admin', 'password');
    await expect(header.logoutLink, 'Administrator is logged in').toBeVisible();

    await authApi.login('admin', 'password');
  });

  const rooms: [string, RoomType, boolean, number, RoomAmenities][] = [
    ['114', RoomType.SINGLE, false, 80, { wifi: false, tv: false, radio: false, refreshments: false, safe: false, views: false }],
    ['115', RoomType.TWIN, false, 150, { wifi: true, tv: true, radio: false, refreshments: false, safe: true, views: false }],
    ['116', RoomType.DOUBLE, true, 200, { wifi: true, tv: true, radio: false, refreshments: true, safe: true, views: false }],
    ['117', RoomType.FAMILY, true, 250, { wifi: true, tv: true, radio: true, refreshments: true, safe: true, views: true }],
    ['118', RoomType.SUITE, true, 300, { wifi: true, tv: true, radio: true, refreshments: true, safe: true, views: true }]
  ];
  for (const room of rooms) {
    test(`User must be able to create new ${room[1]} room named ${room[0]} 
    by filling up all mandatory fields @sanity @management @room-management`, async ({
      page
    }) => {
      const name = room[0];
      const type = room[1];
      const accessible = room[2];
      const price = room[3];
      const amenities = room[4];
      await roomBuildingBlock.createRoom(name, type, accessible, price, amenities);

      const accessibleString = accessible.toString();
      const priceString = price.toString();
      const amenitiesString = getRoomDetailsFromAmenities(amenities);
      const roomRecord = page.locator(`//div[@data-testid='roomlisting'][.//p[contains(@id,'${name}')]]`).last();
      await expect(roomRecord, `Room ${name} is not created!`).toBeVisible();
      await expect(roomRecord.locator('p[id*=roomName]'), `Room ${name} has correct name: ${name}`).toContainText(name);
      await expect(roomRecord.locator('p[id*=type]'), `Room ${name} has correct type: ${type}`).toContainText(type);
      await expect(roomRecord.locator('p[id*=accessible]'), `Room ${name} has correct accessibility: ${accessibleString}`).toContainText(
        accessibleString
      );
      await expect(roomRecord.locator('p[id*=roomPrice]'), `Room ${name} has correct price: ${priceString}`).toContainText(priceString);
      await expect(roomRecord.locator('p[id*=details]'), `Room ${name} has correct details: ${amenitiesString}`).toContainText(amenitiesString);
      await roomApi.deleteAllRooms(name);
    });
  }

  test('User must NOT be able to create new room without filling up room name field @management @room-management', async () => {
    await roomBuildingBlock.createRoom('', RoomType.TWIN, false, 55, { wifi: true, tv: true, radio: false, refreshments: false, safe: false, views: false });
    await expect(roomsPage.errorMessages, 'Error messages are displayed').toBeVisible();
    const errorMessage = 'Room name must be set';
    await expect(roomsPage.errorMessages, `Error message '${errorMessage}' is displayed`).toContainText(errorMessage);
  });

  test('User must NOT be able to create new room without filling up room price field @management @room-management', async () => {
    await roomBuildingBlock.createRoom('314', RoomType.TWIN, false, null, {
      wifi: true,
      tv: true,
      radio: false,
      refreshments: false,
      safe: true,
      views: false
    });
    await expect(roomsPage.errorMessages, 'Error messages are displayed').toBeVisible();
    const errorMessage = 'must be greater than or equal to 1';
    await expect(roomsPage.errorMessages, `Error message '${errorMessage}' is displayed`).toContainText(errorMessage);
  });

  test('User must NOT be able to create new room with price 0 @management @room-management', async () => {
    await roomBuildingBlock.createRoom('314', RoomType.TWIN, false, 0, {
      wifi: false,
      tv: false,
      radio: false,
      refreshments: false,
      safe: false,
      views: false
    });
    await expect(roomsPage.errorMessages, 'Error messages are displayed').toBeVisible();
    const errorMessage = 'must be greater than or equal to 1';
    await expect(roomsPage.errorMessages, `Error message '${errorMessage}' is displayed`).toContainText(errorMessage);
  });
});
