import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 28800, // 8 hours
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.NODE_ENV === 'development' ? 'localhost' : undefined,
    },
    verify: false,
  },
  access: {
    create: () => true, // anyone can create a user
    read: ({ req: { user } }) => {
      return (
        user?.roles?.includes('admin') || {
          id: {
            equals: user?.id,
          },
        }
      )
    },
    update: ({ req: { user } }) => {
      return (
        user?.roles?.includes('admin') || {
          id: {
            equals: user?.id,
          },
        }
      )
    },
    delete: ({ req: { user } }) => (user?.roles?.includes('admin') ? true : false),
    admin: ({ req: { user } }) => (user?.roles?.includes('admin') ? true : false),
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      defaultValue: ['user'],
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },
  ],
}
