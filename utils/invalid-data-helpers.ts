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
    'Abc..123@example.com'
    // 'あいうえお@example.com',
    // 'email@example.web',
    // 'email@example',
    // 'email@111.222.333.44444'
  ];
}
