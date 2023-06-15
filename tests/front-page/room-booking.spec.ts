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

  test('Visitor must be able to book a room for available dates by filling up all mandatory fields @sanity', async () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);

    const bookingSuccessMessage = 'Booking Successful!';
    const bookingConfirmedMessage = 'Congratulations! Your booking has been confirmed';
    await expect(frontPage.bookingConfirmationModal, 'Booking Confirmation modal is displayed').toBeVisible();
    await expect(frontPage.bookingConfirmationModal, `Booking Success Message '${bookingSuccessMessage}' is displayed`).toContainText(
      bookingSuccessMessage
    );
    await expect(frontPage.bookingConfirmationModal, `Booking Confirmed Message '${bookingConfirmedMessage}' is displayed`).toContainText(
      bookingConfirmedMessage
    );
  });

  test('Visitor must NOT be able to book a room without filling up first name field', async () => {
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    await frontPage.bookRoom(roomName, '', lastName, email, phoneNumber);

    const mandatoryMessage = 'Firstname should not be blank';
    const validationMessage = 'size must be between 3 and 18';
    await expect(frontPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(frontPage.bookingErrorMessages, `Mandatory Message '${mandatoryMessage}' is displayed`).toContainText(mandatoryMessage);
    await expect(frontPage.bookingErrorMessages, `Validation Message '${validationMessage}' is displayed`).toContainText(validationMessage);
  });

  for (const firstNameLength of [2, 19]) {
    test(`Visitor must NOT be able to book a room by filling up the first name with invalid length value of ${firstNameLength}, less than 3 and more than 18 characters`, async () => {
      const firstName = faker.string.alphanumeric(firstNameLength);
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);

      const validationMessage = 'size must be between 3 and 18';
      await expect(frontPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(frontPage.bookingErrorMessages, `Validation Message '${validationMessage}' is displayed`).toContainText(validationMessage);
    });
  }

  for (const firstNameLength of [3, 18]) {
    test(`Visitor must be able to book a room by filling up the first name with valid length value of ${firstNameLength}, more than 3 and less than 18 characters`, async () => {
      const firstName = faker.string.alphanumeric(firstNameLength);
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);

      const bookingSuccessMessage = 'Booking Successful!';
      const bookingConfirmedMessage = 'Congratulations! Your booking has been confirmed';
      await expect(frontPage.bookingConfirmationModal, 'Booking Confirmation modal is displayed').toBeVisible();
      await expect(frontPage.bookingConfirmationModal, `Booking Success Message '${bookingSuccessMessage}' is displayed`).toContainText(
        bookingSuccessMessage
      );
      await expect(frontPage.bookingConfirmationModal, `Booking Confirmed Message '${bookingConfirmedMessage}' is displayed`).toContainText(
        bookingConfirmedMessage
      );
    });
  }

  test('Visitor must NOT be able to book a room without filling up last name field', async () => {
    const firstName = faker.person.firstName();
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    await frontPage.bookRoom(roomName, firstName, '', email, phoneNumber);

    const mandatoryMessage = 'Lastname should not be blank';
    const validationMessage = 'size must be between 3 and 30';
    await expect(frontPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(frontPage.bookingErrorMessages, `Mandatory Message '${mandatoryMessage}' is displayed`).toContainText(mandatoryMessage);
    await expect(frontPage.bookingErrorMessages, `Validation Message '${validationMessage}' is displayed`).toContainText(validationMessage);
  });

  for (const lastNameLength of [2, 31]) {
    test(`Visitor must NOT be able to book a room by filling up the last name with invalid length value of ${lastNameLength}, less than 3 and more than 30 characters`, async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.string.alphanumeric(lastNameLength);
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);

      const validationMessage = 'size must be between 3 and 30';
      await expect(frontPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(frontPage.bookingErrorMessages, `Validation Message '${validationMessage}' is displayed`).toContainText(validationMessage);
    });
  }

  for (const lastNameLength of [3, 30]) {
    test(`Visitor must be able to book a room by filling up the last name with valid length value of ${lastNameLength}, more than 3 and less than 30 characters`, async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.string.alphanumeric(lastNameLength);
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);

      const bookingSuccessMessage = 'Booking Successful!';
      const bookingConfirmedMessage = 'Congratulations! Your booking has been confirmed';
      await expect(frontPage.bookingConfirmationModal, 'Booking Confirmation modal is displayed').toBeVisible();
      await expect(frontPage.bookingConfirmationModal, `Booking Success Message '${bookingSuccessMessage}' is displayed`).toContainText(
        bookingSuccessMessage
      );
      await expect(frontPage.bookingConfirmationModal, `Booking Confirmed Message '${bookingConfirmedMessage}' is displayed`).toContainText(
        bookingConfirmedMessage
      );
    });
  }

  test('Visitor must NOT be able to book a room without filling up email field', async () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const phoneNumber = faker.phone.number();
    await frontPage.bookRoom(roomName, firstName, lastName, '', phoneNumber);

    const mandatoryMessage = 'must not be empty';
    await expect(frontPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(frontPage.bookingErrorMessages, `Mandatory Message '${mandatoryMessage}' is displayed`).toContainText(mandatoryMessage);
  });

  for (const invalidEmail of invalidEmails()) {
    test(`Visitor must NOT be able to book a room by filling up email with invalid value: ${invalidEmail}`, async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const phoneNumber = faker.phone.number();
      const email = invalidEmail;
      await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);

      const validationMessage = 'must be a well-formed email address';
      await expect(frontPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(frontPage.bookingErrorMessages, `Validation Message '${validationMessage}' is displayed`).toContainText(validationMessage);
    });
  }

  test('Visitor must NOT be able to book a room without filling up phone field', async () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    await frontPage.bookRoom(roomName, firstName, lastName, email, '');

    const mandatoryMessage = 'must not be empty';
    const validationMessage = 'size must be between 11 and 21';
    await expect(frontPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(frontPage.bookingErrorMessages, `Mandatory Message '${mandatoryMessage}' is displayed`).toContainText(mandatoryMessage);
    await expect(frontPage.bookingErrorMessages, `Validation Message '${validationMessage}' is displayed`).toContainText(validationMessage);
  });

  for (const phoneLength of [10, 22]) {
    test(`Visitor must NOT be able to book a room by filling up the phone with invalid length value of ${phoneLength}, less than 11 and more than 21 characters`, async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const phoneNumber = faker.string.numeric(phoneLength);
      await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);

      const validationMessage = 'size must be between 11 and 21';
      await expect(frontPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(frontPage.bookingErrorMessages, `Validation Message '${validationMessage}' is displayed`).toContainText(validationMessage);
    });
  }

  for (const phoneLength of [11, 21]) {
    test(`Visitor must be able to book a room by filling up the phone with valid length value of ${phoneLength}, more than 11 and less than 21 characters`, async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const phoneNumber = faker.string.numeric(phoneLength);
      await frontPage.bookRoom(roomName, firstName, lastName, email, phoneNumber);

      const bookingSuccessMessage = 'Booking Successful!';
      const bookingConfirmedMessage = 'Congratulations! Your booking has been confirmed';
      await expect(frontPage.bookingConfirmationModal, 'Booking Confirmation modal is displayed').toBeVisible();
      await expect(frontPage.bookingConfirmationModal, `Booking Success Message '${bookingSuccessMessage}' is displayed`).toContainText(
        bookingSuccessMessage
      );
      await expect(frontPage.bookingConfirmationModal, `Booking Confirmed Message '${bookingConfirmedMessage}' is displayed`).toContainText(
        bookingConfirmedMessage
      );
    });
  }

  test.afterEach(async () => {
    await roomApi.deleteAllRooms(roomName);
  });
});
