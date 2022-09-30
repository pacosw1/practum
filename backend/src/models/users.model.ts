import { User } from '@interfaces/users.interface';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


// password: password
class UserModel {
  db: PrismaClient

  constructor(client: PrismaClient) {
    this.db = client
  }

   getUsers = async () => {
    try {
      let items = await prisma.user.findMany()
      return items
    } catch(err) {
      return []
    }
  }
}

export default UserModel;
