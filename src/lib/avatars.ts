export interface Avatar {
  id: string;
  name: string;
  image: string;
  color: string;
}

export const avatars: Avatar[] = [
  {
    id: 'fox',
    name: 'Fox',
    image: '/avatars/fox.svg',
    color: '#FF6B6B'
  },
  {
    id: 'panda',
    name: 'Panda',
    image: '/avatars/panda.svg',
    color: '#4ECDC4'
  },
  {
    id: 'penguin',
    name: 'Penguin',
    image: '/avatars/penguin.svg',
    color: '#45B7D1'
  },
  {
    id: 'koala',
    name: 'Koala',
    image: '/avatars/koala.svg',
    color: '#96CEB4'
  },
  {
    id: 'owl',
    name: 'Owl',
    image: '/avatars/owl.svg',
    color: '#D4A373'
  },
  {
    id: 'cat',
    name: 'Cat',
    image: '/avatars/cat.svg',
    color: '#FFB5A7'
  }
];

export const AVATAR_OPTIONS = avatars.map(avatar => avatar.image)
