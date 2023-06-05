import { test, expect, APIRequestContext } from '@playwright/test';
import { BaseApi } from './BaseApi';
import { BookingApi } from './BookingApi';
import { RoomType, RoomAmenities, getAmenitiesAsList } from '../pages/RoomsPage';
import { getImageUrl } from '../utils/test-data-util';

const path = '/room';

export class RoomApi extends BaseApi {
  readonly bookingApi: BookingApi;

  constructor(request: APIRequestContext) {
    super(request);
    this.bookingApi = new BookingApi(request);
  }

  async createRoom(roomName: string, roomType: RoomType, roomIsAccessible: boolean, roomPrice: number, roomAmenities: RoomAmenities) {
    await this.deleteAllRooms(roomName);
    await test.step(`Create ${roomType} Room with name '${roomName}'`, async () => {
      const response = await this.request.post(`${path}/`, {
        data: {
          roomName: roomName,
          type: roomType,
          accessible: roomIsAccessible.toString(),
          roomPrice: roomPrice.toString(),
          features: getAmenitiesAsList(roomAmenities),
          image: getImageUrl(roomType),
          description: 'Room Created with Automated Test'
        }
      });
      expect(response.status(), `${roomType} Room with name '${roomName}' is created`).toBe(201);
    });
  }

  async deleteRoom(roomId: number) {
    await this.bookingApi.deleteAllBookings(roomId);
    await test.step(`Delete room with id: ${roomId}`, async () => {
      const response = await this.request.delete(`${path}/${roomId}`);
      expect([202, 404], `Room with id: ${roomId} is deleted`).toContain(response.status());
    });
  }

  async deleteAllRooms(roomName: string) {
    await test.step(`Delete all rooms with name: '${roomName}'`, async () => {
      const getRoomsResponse = await this.request.get(`${path}/`);
      expect(getRoomsResponse.status(), 'All rooms are fetched').toBe(200);
      const getRoomsData = JSON.parse(await getRoomsResponse.text());
      const allRooms = getRoomsData.rooms;
      const filteredRoomsByName = allRooms.filter((room) => room.roomName == roomName);
      for (const room of filteredRoomsByName) await this.deleteRoom(room.roomid);
    });
  }
}
