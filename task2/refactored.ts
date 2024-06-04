// some other file - let's say authClient.ts
import superagent from 'superagent'
import dotenv from 'dotenv'

dotenv.config()

const authService = process.env.AUTH_SERVICE_URL

// ...
export async function createInvitation(invitationBody) {
  return superagent.post(`${authService}/invitation`).send(invitationBody)
}

// refactored.ts
import { Express, Request, Response } from 'express'
import authClient from './authClient'
import { validateInvitation } from './validations'
import logger from './mylogger'

export const inviteUserMiddleware = async (req: Request, res: Response) => {
  const { invitationBody } = req.body
  const { shopId } = req.params

  const validationError = validateInvitation(invitationBody)

  if (validationError) {
    return res.status(400).send({
      message: validationError.message
    })
  }

  let shop

  // make sure shop exists
  try {
    shop = await Shop.findById(shopId)
    if (!shop) {
      logger.warn('missing_shop_id', {
        message: `Shop with ID ${shopId} was not found`
      })
      // depending on context, it could be either 400 or 404
      // let's assume 400 and keep a generic error message
      return res.status(400).send({
        message: 'Bad request'
      })
    }
  } catch (error) {
    logger.error('database_failure', {
      message: error.message
    })
    return res.status(500).send({ message: 'An unknown error occurred' })
  }

  let invitation

  // create invitation
  try {
    const response = await authClient.createInvitation(invitationBody)
    if (response.status === 200) {
      return res
        .status(400)
        .json({ message: 'User already invited to this shop' })
    }

    invitation = response.body
  } catch (error) {
    logger.error('auth_service_failure', {
      message: error.message
    })
  }

  let user

  // find or create user
  try {
    user = await User.findOneAndUpdate(
      { authId: invitation.authId },
      {
        authId: invitation.authId,
        email: invitationBody.email
      },
      { upsert: true, new: true }
    )
  } catch (error) {
    logger.error('database_failure', {
      message: error.message
    })
    return res.status(500).send({ message: 'An unknown error occurred' })
  }

  // update shop
  try {
    if (shop.invitations.indexOf(invitation.invitationId) === -1) {
      shop.invitations.push(invitation.invitationId)
    }
    if (shop.users.indexOf(createdUser._id) === -1) {
      shop.users.push(createdUser)
    }

    logger.info('update_shop', {
      message: shop
    })
    await shop.save()
  } catch (error) {
    logger.error('database_failure', {
      message: error.message
    })
    return res.status(500).send({ message: 'An unknown error occurred' })
  }

  return res.status(201).send()
}
