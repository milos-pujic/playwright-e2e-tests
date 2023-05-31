import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { FrontPage } from '../pages/FrontPage';
import { invalidEmails } from '../utils/test-data-util';

test.describe('Contact Tests', () => {
  let frontPage: FrontPage;

  test.beforeEach(async ({ page, baseURL }) => {
    frontPage = new FrontPage(page);
    await page.context().addCookies([{ name: 'banner', value: 'true', url: baseURL }]);
    await frontPage.goto();
  });

  test('Visitor must be able to contact the property by filling up all mandatory fields', async () => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const subject = faker.lorem.sentence(3);
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage(name, email, phoneNumber, subject, message);
    await expect(frontPage.contactSuccessMessage).toContainText(`Thanks for getting in touch ${name}`);
  });

  test('Visitor must NOT be able to contact the property without filling up name field', async () => {
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const subject = faker.lorem.sentence(3);
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage('', email, phoneNumber, subject, message);
    await expect(frontPage.contactErrorMessages).toContainText('Name may not be blank');
  });

  test('Visitor must NOT be able to contact the property without filling up email field', async () => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const phoneNumber = faker.phone.number();
    const subject = faker.lorem.sentence(3);
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage(name, '', phoneNumber, subject, message);
    await expect(frontPage.contactErrorMessages).toContainText('Email may not be blank');
  });

  test('Visitor must NOT be able to contact the property without filling up phone field', async () => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const email = faker.internet.email();
    const subject = faker.lorem.sentence(3);
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage(name, email, '', subject, message);
    await expect(frontPage.contactErrorMessages).toContainText('Phone may not be blank');
    await expect(frontPage.contactErrorMessages).toContainText('Phone must be between 11 and 21 characters');
  });

  test('Visitor must NOT be able to contact the property without filling up subject field', async () => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage(name, email, phoneNumber, '', message);
    await expect(frontPage.contactErrorMessages).toContainText('Subject may not be blank');
    await expect(frontPage.contactErrorMessages).toContainText('Subject must be between 5 and 100 characters');
  });

  test('Visitor must NOT be able to contact the property without filling up message field', async () => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const subject = faker.lorem.sentence(3);
    await frontPage.sendMessage(name, email, phoneNumber, subject, '');
    await expect(frontPage.contactErrorMessages).toContainText('Message may not be blank');
    await expect(frontPage.contactErrorMessages).toContainText('Message must be between 20 and 2000 characters');
  });

  for (const invalidEmail of invalidEmails()) {
    test(`Visitor must NOT be able to contact the property by filling up email with invalid value: ${invalidEmail}`, async () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const phoneNumber = faker.phone.number();
      const subject = faker.lorem.sentence(3);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, invalidEmail, phoneNumber, subject, message);
      await expect(frontPage.contactErrorMessages).toContainText('must be a well-formed email address');
    });
  }

  for (const invalidPhone of ['1234567890', '1234567890123456789012']) {
    test(`Visitor must NOT be able to contact the property by filling up the phone with invalid length, less than 11 and more than 21 characters: ${invalidPhone}`, async () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const subject = faker.lorem.sentence(3);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, email, invalidPhone, subject, message);
      await expect(frontPage.contactErrorMessages).toContainText('Phone must be between 11 and 21 characters');
    });
  }

  for (const validPhone of ['12345678901', '123456789012345678901']) {
    test(`Visitor must be able to contact the property by filling up phone with valid length, between 11 and 21 characters: ${validPhone}`, async () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const subject = faker.lorem.sentence(3);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, email, validPhone, subject, message);
      await expect(frontPage.contactSuccessMessage).toContainText(`Thanks for getting in touch ${name}`);
    });
  }

  for (const invalidSubjectLength of [4, 101]) {
    test(`Visitor must NOT be able to contact the property by filling up the subject with invalid length value of ${invalidSubjectLength}, less than 5 and more than 100 characters`, async () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      const subject = faker.string.alphanumeric(invalidSubjectLength);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, email, phoneNumber, subject, message);
      await expect(frontPage.contactErrorMessages).toContainText('Subject must be between 5 and 100 characters');
    });
  }

  for (const validSubjectLength of [5, 100]) {
    test(`Visitor must be able to contact the property by filling up the subject with valid length value of ${validSubjectLength}, between 5 and 100 characters`, async () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      const subject = faker.string.alphanumeric(validSubjectLength);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, email, phoneNumber, subject, message);
      await expect(frontPage.contactSuccessMessage).toContainText(`Thanks for getting in touch ${name}`);
    });
  }

  for (const invalidMessageLength of [19, 2001]) {
    test(`Visitor must NOT be able to contact the property by filling up the message with invalid length value of ${invalidMessageLength}, less than 20 and more than 2000 characters`, async () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      const subject = faker.lorem.sentence(3);
      const message = faker.string.alphanumeric(invalidMessageLength);
      await frontPage.sendMessage(name, email, phoneNumber, subject, message);
      await expect(frontPage.contactErrorMessages).toContainText('Message must be between 20 and 2000 characters');
    });
  }

  for (const validMessageLength of [20, 2000]) {
    test(`Visitor must be able to contact the property by filling up the message with valid length value of ${validMessageLength}, between 20 and 2000 characters`, async () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      const subject = faker.lorem.sentence(3);
      const message = faker.string.alphanumeric(validMessageLength);
      await frontPage.sendMessage(name, email, phoneNumber, subject, message);
      await expect(frontPage.contactSuccessMessage).toContainText(`Thanks for getting in touch ${name}`);
    });
  }
});
