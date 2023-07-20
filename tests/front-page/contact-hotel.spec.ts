import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { FrontPage } from '../../pages/FrontPage';
import { invalidEmails } from '../../utils/test-data-util';

test.describe('Contact Hotel Tests', () => {
  let frontPage: FrontPage;

  test.beforeEach(async ({ page, baseURL }) => {
    frontPage = new FrontPage(page);
    await frontPage.hideCookieBanner(baseURL);
    await frontPage.goto();
  });

  test('Visitor must be able to contact the property by filling up all mandatory fields @sanity @contact', async () => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const subject = faker.lorem.sentence(3);
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage(name, email, phoneNumber, subject, message);

    const successMessage = `Thanks for getting in touch ${name}`;
    await expect(frontPage.contactSuccessMessage, 'Messages Sent Successful').toBeVisible();
    await expect(frontPage.contactSuccessMessage, `Success Message '${successMessage}' displayed`).toContainText(successMessage);
  });

  test('Visitor must NOT be able to contact the property without filling up name field @contact', async () => {
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const subject = faker.lorem.sentence(3);
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage('', email, phoneNumber, subject, message);

    const mandatoryMessage = 'Name may not be blank';
    await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(frontPage.contactErrorMessages, `Mandatory Message '${mandatoryMessage}' is displayed`).toContainText(mandatoryMessage);
  });

  test('Visitor must NOT be able to contact the property without filling up email field @contact', async () => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const phoneNumber = faker.phone.number();
    const subject = faker.lorem.sentence(3);
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage(name, '', phoneNumber, subject, message);

    const mandatoryMessage = 'Email may not be blank';
    await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(frontPage.contactErrorMessages, `Mandatory Message '${mandatoryMessage}' is displayed`).toContainText(mandatoryMessage);
  });

  test('Visitor must NOT be able to contact the property without filling up phone field @contact', async () => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const email = faker.internet.email();
    const subject = faker.lorem.sentence(3);
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage(name, email, '', subject, message);

    const mandatoryMessage = 'Phone may not be blank';
    const validationMessage = 'Phone must be between 11 and 21 characters';
    await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(frontPage.contactErrorMessages, `Mandatory Message '${mandatoryMessage}' is displayed`).toContainText(mandatoryMessage);
    await expect(frontPage.contactErrorMessages, `Validation Message '${validationMessage}' is displayed`).toContainText(validationMessage);
  });

  test('Visitor must NOT be able to contact the property without filling up subject field @contact', async () => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage(name, email, phoneNumber, '', message);

    const mandatoryMessage = 'Subject may not be blank';
    const validationMessage = 'Subject must be between 5 and 100 characters';
    await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(frontPage.contactErrorMessages, `Mandatory Message '${mandatoryMessage}' is displayed`).toContainText(mandatoryMessage);
    await expect(frontPage.contactErrorMessages, `Validation Message '${validationMessage}' is displayed`).toContainText(validationMessage);
  });

  test('Visitor must NOT be able to contact the property without filling up message field @contact', async () => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const subject = faker.lorem.sentence(3);
    await frontPage.sendMessage(name, email, phoneNumber, subject, '');

    const mandatoryMessage = 'Message may not be blank';
    const validationMessage = 'Message must be between 20 and 2000 characters';
    await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(frontPage.contactErrorMessages, `Mandatory Message '${mandatoryMessage}' is displayed`).toContainText(mandatoryMessage);
    await expect(frontPage.contactErrorMessages, `Validation Message '${validationMessage}' is displayed`).toContainText(validationMessage);
  });

  for (const invalidEmail of invalidEmails()) {
    test(`Visitor must NOT be able to contact the property by filling up email with invalid value: ${invalidEmail} @contact`, async () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const phoneNumber = faker.phone.number();
      const subject = faker.lorem.sentence(3);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, invalidEmail, phoneNumber, subject, message);

      const validationMessage = 'must be a well-formed email address';
      await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(frontPage.contactErrorMessages, `Validation Message '${validationMessage}' is displayed`).toContainText(validationMessage);
    });
  }

  for (const invalidPhone of ['1234567890', '1234567890123456789012']) {
    test(`Visitor must NOT be able to contact the property by filling up the phone with invalid length, less than 11 and more than 21 characters: ${invalidPhone} @contact`, async () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const subject = faker.lorem.sentence(3);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, email, invalidPhone, subject, message);

      const validationMessage = 'Phone must be between 11 and 21 characters';
      await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(frontPage.contactErrorMessages, `Validation Message '${validationMessage}' is displayed`).toContainText(validationMessage);
    });
  }

  for (const validPhone of ['12345678901', '123456789012345678901']) {
    test(`Visitor must be able to contact the property by filling up phone with valid length, between 11 and 21 characters: ${validPhone} @contact`, async () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const subject = faker.lorem.sentence(3);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, email, validPhone, subject, message);

      const successMessage = `Thanks for getting in touch ${name}`;
      await expect(frontPage.contactSuccessMessage, 'Messages Sent Successful').toBeVisible();
      await expect(frontPage.contactSuccessMessage, `Success Message '${successMessage}' displayed`).toContainText(successMessage);
    });
  }

  for (const invalidSubjectLength of [4, 101]) {
    test(`Visitor must NOT be able to contact the property by filling up the subject with invalid length value of ${invalidSubjectLength}, less than 5 and more than 100 characters @contact`, async () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      const subject = faker.string.alphanumeric(invalidSubjectLength);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, email, phoneNumber, subject, message);

      const validationMessage = 'Subject must be between 5 and 100 characters';
      await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(frontPage.contactErrorMessages, `Validation Message '${validationMessage}' is displayed`).toContainText(validationMessage);
    });
  }

  for (const validSubjectLength of [5, 100]) {
    test(`Visitor must be able to contact the property by filling up the subject with valid length value of ${validSubjectLength}, between 5 and 100 characters @contact`, async () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      const subject = faker.string.alphanumeric(validSubjectLength);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, email, phoneNumber, subject, message);

      const successMessage = `Thanks for getting in touch ${name}`;
      await expect(frontPage.contactSuccessMessage, 'Messages Sent Successful').toBeVisible();
      await expect(frontPage.contactSuccessMessage, `Success Message '${successMessage}' displayed`).toContainText(successMessage);
    });
  }

  for (const invalidMessageLength of [19, 2001]) {
    test(`Visitor must NOT be able to contact the property by filling up the message with invalid length value of ${invalidMessageLength}, less than 20 and more than 2000 characters @contact`, async () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      const subject = faker.lorem.sentence(3);
      const message = faker.string.alphanumeric(invalidMessageLength);
      await frontPage.sendMessage(name, email, phoneNumber, subject, message);

      const validationMessage = 'Message must be between 20 and 2000 characters';
      await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(frontPage.contactErrorMessages, `Validation Message '${validationMessage}' is displayed`).toContainText(validationMessage);
    });
  }

  for (const validMessageLength of [20, 2000]) {
    test(`Visitor must be able to contact the property by filling up the message with valid length value of ${validMessageLength}, between 20 and 2000 characters @contact`, async () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      const subject = faker.lorem.sentence(3);
      const message = faker.string.alphanumeric(validMessageLength);
      await frontPage.sendMessage(name, email, phoneNumber, subject, message);

      const successMessage = `Thanks for getting in touch ${name}`;
      await expect(frontPage.contactSuccessMessage, 'Messages Sent Successful').toBeVisible();
      await expect(frontPage.contactSuccessMessage, `Success Message '${successMessage}' displayed`).toContainText(successMessage);
    });
  }
});
