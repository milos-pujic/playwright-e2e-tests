import { RoomType } from '../pages/RoomsPage';

export function invalidEmails() {
  return [
    'plainaddress',
    '#@%^%#$@#$@#.com',
    '@example.com Joe Smith',
    '<email@example.com>',
    'email.example.com',
    'email@example@example.com',
    '.email@example.com',
    'email..email@example.com',
    'email@example.com (Joe Smith)',
    'email@-example.com',
    'email@example..com',
    'Abc..123@example.com',
    'email@example'
  ];
}

export function getImageUrl(roomType: RoomType) {
  if (roomType == RoomType.SINGLE) return 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg';
  else if (roomType == RoomType.TWIN) return 'https://images.pexels.com/photos/14021932/pexels-photo-14021932.jpeg';
  else if (roomType == RoomType.DOUBLE) return 'https://images.pexels.com/photos/11857305/pexels-photo-11857305.jpeg';
  else if (roomType == RoomType.FAMILY) return 'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg';
  else return 'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg';
}
