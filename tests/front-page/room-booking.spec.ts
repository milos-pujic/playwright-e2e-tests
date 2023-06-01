import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { AuthApi } from '../../apis/AuthApi';
import { FrontPage } from '../../pages/FrontPage';
import { RoomApi } from '../../apis/RoomApi';
import { RoomAmenities, RoomType } from '../../pages/RoomsPage';
import { invalidEmails } from '../../utils/test-data-util';

test.describe('Room Booking Tests', () => {
  let frontPage: FrontPage;

  let authApi: AuthApi;
  let roomApi: RoomApi;

  const roomName: string = faker.number.int({ min: 100, max: 999 }).toString();
  const roomType: RoomType = faker.helpers.arrayElement([RoomType.SINGLE, RoomType.TWIN, RoomType.DOUBLE, RoomType.FAMILY, RoomType.SUITE]);
  const roomIsAccessible: boolean = faker.datatype.boolean();
  const roomPrice: number = faker.number.int({ min: 100, max: 999 });
  const roomAmenities: RoomAmenities = {
    wifi: faker.datatype.boolean(),
    tv: faker.datatype.boolean(),
    radio: faker.datatype.boolean(),
    refreshments: faker.datatype.boolean(),
    safe: faker.datatype.boolean(),
    views: faker.datatype.boolean()
  };

  test.beforeEach(async ({ page, request, baseURL }) => {
    frontPage = new FrontPage(page);

    authApi = new AuthApi(request);
    roomApi = new RoomApi(request);

    await frontPage.hideBanner(baseURL);
    await authApi.login('admin', 'password');
    await roomApi.createRoom(roomName, roomType, roomIsAccessible, roomPrice, roomAmenities);

    await frontPage.goto();
  });

  test('Visitor must be able to book a room for available dates by filling up all mandatory fields', async () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);
    await expect(frontPage.bookingConfirmationModal).toBeVisible();
    await expect(frontPage.bookingConfirmationModal).toContainText('Booking Successful!');
    await expect(frontPage.bookingConfirmationModal).toContainText('Congratulations! Your booking has been confirmed');
  });

  test('Visitor must NOT be able to book a room without filling up first name field', async () => {
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    await frontPage.bookRoom(roomName, '', lastName, email, phoneNumber);
    await expect(frontPage.bookingErrorMessages).toBeVisible();
    await expect(frontPage.bookingErrorMessages).toContainText('Firstname should not be blank');
    await expect(frontPage.bookingErrorMessages).toContainText('size must be between 3 and 18');
  });

  for (const firstNameLength of [2, 19]) {
    test(`Visitor must NOT be able to book a room by filling up the first name with invalid length value of ${firstNameLength}, less than 3 and more than 18 characters`, async () => {
      const firstName = faker.string.alphanumeric(firstNameLength);
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);
      await expect(frontPage.bookingErrorMessages).toBeVisible();
      await expect(frontPage.bookingErrorMessages).toContainText('size must be between 3 and 18');
    });
  }

  for (const firstNameLength of [3, 18]) {
    test(`Visitor must be able to book a room by filling up the first name with valid length value of ${firstNameLength}, more than 3 and less than 18 characters`, async () => {
      const firstName = faker.string.alphanumeric(firstNameLength);
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);
      await expect(frontPage.bookingConfirmationModal).toBeVisible();
      await expect(frontPage.bookingConfirmationModal).toContainText('Booking Successful!');
      await expect(frontPage.bookingConfirmationModal).toContainText('Congratulations! Your booking has been confirmed');
    });
  }

  test('Visitor must NOT be able to book a room without filling up last name field', async () => {
    const firstName = faker.person.firstName();
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    await frontPage.bookRoom(roomName, firstName, '', email, phoneNumber);
    await expect(frontPage.bookingErrorMessages).toBeVisible();
    await expect(frontPage.bookingErrorMessages).toContainText('Lastname should not be blank');
    await expect(frontPage.bookingErrorMessages).toContainText('size must be between 3 and 30');
  });

  for (const lastNameLength of [2, 31]) {
    test(`Visitor must NOT be able to book a room by filling up the last name with invalid length value of ${lastNameLength}, less than 3 and more than 30 characters`, async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.string.alphanumeric(lastNameLength);
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);
      await expect(frontPage.bookingErrorMessages).toBeVisible();
      await expect(frontPage.bookingErrorMessages).toContainText('size must be between 3 and 30');
    });
  }

  for (const lastNameLength of [3, 30]) {
    test(`Visitor must be able to book a room by filling up the last name with valid length value of ${lastNameLength}, more than 3 and less than 30 characters`, async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.string.alphanumeric(lastNameLength);
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);
      await expect(frontPage.bookingConfirmationModal).toBeVisible();
      await expect(frontPage.bookingConfirmationModal).toContainText('Booking Successful!');
      await expect(frontPage.bookingConfirmationModal).toContainText('Congratulations! Your booking has been confirmed');
    });
  }

  test('Visitor must NOT be able to book a room without filling up email field', async () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const phoneNumber = faker.phone.number();
    await frontPage.bookRoom(roomName, firstName, lastName, '', phoneNumber);
    await expect(frontPage.bookingErrorMessages).toBeVisible();
    await expect(frontPage.bookingErrorMessages).toContainText('must not be empty');
  });

  for (const invalidEmail of invalidEmails()) {
    test(`Visitor must NOT be able to book a room by filling up email with invalid value: ${invalidEmail}`, async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const phoneNumber = faker.phone.number();
      const email = invalidEmail;
      await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);
      await expect(frontPage.bookingErrorMessages).toBeVisible();
      await expect(frontPage.bookingErrorMessages).toContainText('must be a well-formed email address');
    });
  }

  test('Visitor must NOT be able to book a room without filling up phone field', async () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    await frontPage.bookRoom(roomName, firstName, lastName, email, '');
    await expect(frontPage.bookingErrorMessages).toBeVisible();
    await expect(frontPage.bookingErrorMessages).toContainText('must not be empty');
    await expect(frontPage.bookingErrorMessages).toContainText('size must be between 11 and 21');
  });

  for (const phoneLength of [10, 22]) {
    test(`Visitor must NOT be able to book a room by filling up the phone with invalid length value of ${phoneLength}, less than 11 and more than 21 characters`, async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const phoneNumber = faker.string.numeric(phoneLength);
      await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);
      await expect(frontPage.bookingErrorMessages).toBeVisible();
      await expect(frontPage.bookingErrorMessages).toContainText('size must be between 11 and 21');
    });
  }

  for (const phoneLength of [11, 21]) {
    test(`Visitor must be able to book a room by filling up the phone with valid length value of ${phoneLength}, more than 11 and less than 21 characters`, async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const phoneNumber = faker.string.numeric(phoneLength);
      await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);
      await expect(frontPage.bookingConfirmationModal).toBeVisible();
      await expect(frontPage.bookingConfirmationModal).toContainText('Booking Successful!');
      await expect(frontPage.bookingConfirmationModal).toContainText('Congratulations! Your booking has been confirmed');
    });
  }

  test.afterEach(async () => {
    await roomApi.deleteAllRooms(roomName);
  });
});
