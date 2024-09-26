import { CollectionConfig } from 'payload/types'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: "sub",
      label: "sub",
      type: "text",
      admin: { readOnly: true },
      access: { update: () => false },
    },
    {
      name: "pictureURL",
      label: "pictureURL",
      type: "text",
      admin: { readOnly: true },
      access: { update: () => false },
    }
    // Email added by default
    // Add more fields as needed
  ],
}

export default Users
