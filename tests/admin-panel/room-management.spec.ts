import { test, expect } from '@playwright/test';
import { RoomsPage, RoomAmenities, getRoomDetailsFromAmenities, RoomType } from '../../pages/RoomsPage';
import { AuthApi } from '../../apis/AuthApi';
import { AdminPage } from '../../pages/AdminPage';
import { Header } from '../../pages/components/Header';
import { RoomApi } from '../../apis/RoomApi';

test.describe('Room Management Tests', () => {
  let adminPage: AdminPage;
  let header: Header;
  let roomsPage: RoomsPage;

  let authApi: AuthApi;
  let roomApi: RoomApi;

  test.beforeEach(async ({ page, request, baseURL }) => {
    adminPage = new AdminPage(page);
    header = new Header(page);
    roomsPage = new RoomsPage(page);

    authApi = new AuthApi(request);
    roomApi = new RoomApi(request);

    await adminPage.hideBanner(baseURL);
    await adminPage.goto();
    await adminPage.login('admin', 'password');
    await expect(header.logoutLink).toBeVisible();

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
    test(`User must be able to create new ${room[1]} room named ${room[0]} by filling up all mandatory fields`, async ({ page }) => {
      const name = room[0];
      const type = room[1];
      const accessible = room[2];
      const price = room[3];
      const amenities = room[4];
      await roomsPage.createRoom(name, type, accessible, price, amenities);
      const roomRecord = page.locator(`//div[@data-testid='roomlisting'][.//p[contains(@id,'${name}')]]`).last();
      await expect(roomRecord).toBeVisible();
      await expect(roomRecord.locator('p[id*=roomName]')).toContainText(name);
      await expect(roomRecord.locator('p[id*=type]')).toContainText(type);
      await expect(roomRecord.locator('p[id*=accessible]')).toContainText(accessible ? 'true' : 'false');
      await expect(roomRecord.locator('p[id*=roomPrice]')).toContainText(price.toString());
      await expect(roomRecord.locator('p[id*=details]')).toContainText(getRoomDetailsFromAmenities(amenities));
      await roomApi.deleteAllRooms(name);
    });
  }

  test('User must NOT be able to create new room without filling up room name field', async () => {
    await roomsPage.createRoom('', RoomType.TWIN, false, 55, { wifi: true, tv: true, radio: false, refreshments: false, safe: false, views: false });
    await expect(roomsPage.contactErrorMessages).toContainText('Room name must be set');
  });

  test('User must NOT be able to create new room without filling up room price field', async () => {
    await roomsPage.createRoom('314', RoomType.TWIN, false, null, {
      wifi: true,
      tv: true,
      radio: false,
      refreshments: false,
      safe: true,
      views: false
    });
    await expect(roomsPage.contactErrorMessages).toContainText('must be greater than or equal to 1');
  });

  test('User must NOT be able to create new room with price 0', async () => {
    await roomsPage.createRoom('314', RoomType.TWIN, false, 0, {
      wifi: false,
      tv: false,
      radio: false,
      refreshments: false,
      safe: false,
      views: false
    });
    await expect(roomsPage.contactErrorMessages).toContainText('must be greater than or equal to 1');
  });
});
