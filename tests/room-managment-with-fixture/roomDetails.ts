import { RoomType } from '../../pages/RoomsPage';

export interface RoomDetails {
  room_number: string,
  room_type: RoomType,
  Accesiblity: boolean,
  price: number;
  
  ammenties:{
    wifi: boolean,
    tv: boolean,
    radio: boolean,
    refreshments: boolean,
    safe: boolean,
    views: boolean
  } 
}

