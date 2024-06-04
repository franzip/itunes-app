# Task 2

## What do you think is wrong with the code, if anything?

There are several issues with the implementation in `old.js`.

1. The `authUrl` variable pointing to the authentication service should not be hardcoded and should rather come [from the environment](https://www.12factor.net/config)
2. The code suffers from what is usually referred to as "callback hell" - with a lot of nesting and it's very hard to read
3. There is no validation at all for the `invitationBody` sent by a client
4. The order of operations seems to be off: the code is creating side effects on `User` collection without even checking first if a shop exists given `shopId`.
   Let's imagine client passes a valid `invitationBody` but a non existent `shopId`: this could result in a user being created (since we are upserting `User` collection) when request should just fail
5. In case the shop is not found (`Shop.findById(shopId)` call on line 18), we should not really return 500 but rather a more appropriate status code (400-499) depending on the context. For example, if the service is available to public internet, probably 404 as status code is not a good idea as it would allow enumeration attacks
6. Code from line 22 to line 26 seems to be duplicating an invitation for an existing shop, which seems like a bug.
   My guess is that the intent of the code is actually to add the `invitationId` to the list of invitations for the shop.
7. There is no logging whatsoever, which means it will be really hard to figure out what went wrong in case of issues
8. It's hard to tell without more information about the underlying business logic, but it looks weird to me that an authentication service returns 200 in case a user was already added to the shop (line 34).
9. The structure of the errors being returned as JSON response is not consistent
10. The code is returning `invitationResponse` to the client, which could be inappropriate since `invitationResponse.body.authId` is probably not something to expose to the outside world

## Can you see any potential problems that could lead to exceptions

1. There is no error handling on the API call happening through `superagent`, which means that the whole business logic contained in the callback will run when it really shouldn't, with impredictable results
2. Array prototype methods (`push` and `indexOf`) called on `shop.invitations` and `shop.users` could cause exceptions to be thrown at runtime
3. `shop.save()` could also throw an exception and it would not be caught

## How would you refactor this code

Check `refactored.ts` file
