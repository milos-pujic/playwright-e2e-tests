import { APIRequestContext, expect } from '@playwright/test';
import { BaseApi } from './BaseApi';

const path = '/booking';

export class BookingApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async deleteBooking(bookingId: number) {
    const response = await this.request.delete(`${path}/${bookingId}`);
    expect([202, 404]).toContain(response.status);
  }

  async deleteAllBookings(roomId: number) {
    const response = await this.request.get(`${path}/?roomid=${roomId}`);
    expect(response.status()).toBe(200);
    const data = JSON.parse(await response.text());
    if (data.bookings.length > 0) {
      for (const booking of data.bookings) await this.deleteBooking(booking.bookingid);
    }
  }
}
