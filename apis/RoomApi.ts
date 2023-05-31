import { APIRequestContext, expect } from '@playwright/test';
import { BaseApi } from './BaseApi';
import { BookingApi } from './BookingApi';

const path = '/room';

export class RoomApi extends BaseApi {
  readonly bookingApi: BookingApi;

  constructor(request: APIRequestContext) {
    super(request);
    this.bookingApi = new BookingApi(request);
  }

  async deleteRoom(roomId: number) {
    await this.bookingApi.deleteAllBookings(roomId);
    const response = await this.request.delete(`${path}/${roomId}`);
    expect([202, 404]).toContain(response.status());
  }

  async deleteAllRooms(roomName: string) {
    const getRoomsResponse = await this.request.get(`${path}/`);
    expect(getRoomsResponse.status()).toBe(200);
    const getRoomsData = JSON.parse(await getRoomsResponse.text());
    if (getRoomsData.rooms.length > 0) {
      for (const room of getRoomsData.rooms) {
        if (room.roomName == roomName) await this.deleteRoom(room.roomid);
      }
    }
  }
}
