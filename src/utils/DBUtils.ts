import { MongoClient, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'

export default class DBUtils {
  static getUri(): string {
    const uri = `mongodb+srv://${process.env.NEXT_PRIVATE_DB_ID}:${process.env.NEXT_PRIVATE_DB_PASSWORD}@versusgamedev.tibkszx.mongodb.net/${process.env.NEXT_PRIVATE_DB_NAME}?retryWrites=true&w=majority&appName=VersusGameDev`

    return uri
  }

  static async insertDocument(dbName: string, collectionName: string, data: object): boolean {
    const uri = this.getUri()
    console.log('uri:', uri)

    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })

    try {
      await client.connect()

      const database = client.db(dbName)
      const collection = database.collection(collectionName)

      const result = await collection.insertOne(data)

      console.log(result)

      return true
    } catch (err) {
      console.log(err)
    } finally {
      await client.close()
    }

    return false
  }

  static async connect() {
    if (mongoose.connections[0].readyState) return

    try {
      await mongoose.connect(this.getUri(), {})
      console.log('Mongo Connection successfully established.')
    } catch (error) {
      throw new Error('Error connecting to Mongoose', error)
    }
  }
}
