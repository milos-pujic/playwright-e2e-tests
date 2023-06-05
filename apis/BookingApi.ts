import { APIRequestContext, test, expect } from '@playwright/test';
import { BaseApi } from './BaseApi';

const path = '/booking';

export class BookingApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async deleteBooking(bookingId: number) {
    await test.step(`Delete Booking with id: ${bookingId}`, async () => {
      const response = await this.request.delete(`${path}/${bookingId}`);
      expect([202, 404], `Booking with id: ${bookingId} deleted`).toContain(response.status());
    });
  }

  async deleteAllBookings(roomId: number) {
    await test.step(`Delete all Bookings for room id: ${roomId}`, async () => {
      const response = await this.request.get(`${path}/?roomid=${roomId}`);
      expect(response.status(), `All Bookings for room id: ${roomId} fetched`).toBe(200);
      const data = JSON.parse(await response.text());
      for (const booking of data.bookings) await this.deleteBooking(booking.bookingid);
    });
  }
}
