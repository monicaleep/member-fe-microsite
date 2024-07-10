import {app, router} from './server.js'

app.use("/", router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[server]: Server is running`);
});