import {app, router} from '../../src/server.js'
import serverless from "serverless-http";

app.use('/', router)
export const handler = serverless(app)

export default handler
