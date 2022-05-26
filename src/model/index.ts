import { config } from '../config';
import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  name: String,
  email: String,
  topics: [String],
  createdAt: Date,
});

const dbConnection = {
  connect: async () => {
    await mongoose
      .connect(config.DB_HOST + '/' + config.DB_NAME, config.DB_OPTS)
      .then((resp) => {
        console.log('Connected DB successfully!');
      });
  },
  connection: mongoose.connection,
  Author: mongoose.model('Author', authorSchema),
};

export default dbConnection;
