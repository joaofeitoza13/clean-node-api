import { setupApp } from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { Express } from 'express'
import request from 'supertest'

let accountCollection: Collection
let app: Express

describe('Login Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'João',
          email: 'joaofeitoza.13@gmail.com',
          password: '1234',
          passwordConfirmation: '1234'
        })
        .expect(200)
    })

    test('Should return 403 on already signedup user', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'João',
          email: 'joaofeitoza.13@gmail.com',
          password: '1234',
          passwordConfirmation: '1234'
        })
      await request(app)
        .post('/api/signup')
        .send({
          name: 'João',
          email: 'joaofeitoza.13@gmail.com',
          password: '1234',
          passwordConfirmation: '1234'
        })
        .expect(403)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('1234', 12)
      await accountCollection.insertOne({
        name: 'João',
        email: 'joaofeitoza.13@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'joaofeitoza.13@gmail.com',
          password: '1234'
        })
        .expect(200)
    })

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'joaofeitoza.13@gmail.com',
          password: '1234'
        })
        .expect(401)
    })
  })
})
