import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const permissions = [
  {
    key: 'forum.thread.create',
    resource: 'forum.thread',
    action: 'create',
    description: 'Create a new forum discussion thread',
  },
  {
    key: 'forum.post.reply',
    resource: 'forum.post',
    action: 'reply',
    description: 'Reply to a forum discussion thread',
  },
  {
    key: 'forum.moderate',
    resource: 'forum',
    action: 'moderate',
    description: 'Moderate forum threads and replies',
  },
  {
    key: 'engineers.read',
    resource: 'engineers',
    action: 'read',
    description: 'View engineers directory pages',
  },
  {
    key: 'materials.read',
    resource: 'materials',
    action: 'read',
    description: 'View learning materials',
  },
  {
    key: 'admin.access',
    resource: 'admin',
    action: 'access',
    description: 'Access admin pages and APIs',
  },
]

const roles = [
  {
    key: 'community_member',
    name: 'Community Member',
    description: 'Default authenticated user role',
    isSystem: true,
    permissionKeys: ['forum.thread.create', 'forum.post.reply'],
  },
  {
    key: 'community_moderator',
    name: 'Community Moderator',
    description: 'Forum moderation role',
    isSystem: true,
    permissionKeys: ['forum.thread.create', 'forum.post.reply', 'forum.moderate'],
  },
]

async function main() {
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: {
        resource: permission.resource,
        action: permission.action,
        description: permission.description,
      },
      create: permission,
    })
  }

  for (const role of roles) {
    const roleRecord = await prisma.role.upsert({
      where: { key: role.key },
      update: {
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
      },
      create: {
        key: role.key,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
      },
    })

    for (const permissionKey of role.permissionKeys) {
      const permissionRecord = await prisma.permission.findUnique({
        where: { key: permissionKey },
        select: { id: true },
      })

      if (!permissionRecord) continue

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: roleRecord.id,
            permissionId: permissionRecord.id,
          },
        },
        update: {},
        create: {
          roleId: roleRecord.id,
          permissionId: permissionRecord.id,
        },
      })
    }
  }

  console.log('Seeded RBAC roles and permissions')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
