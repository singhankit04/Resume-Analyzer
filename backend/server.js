import 'dotenv/config';
import app from './src/app.js';
import { connectDb } from './src/config/db.js';

const PORT= process.env.PORT || 3000;


const startServer = async () => {
    try {
        await connectDb();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })

    }catch (err) {
            console.log(err);
            process.exit(1);
        }
}
startServer();