import mongoose from 'mongoose';

const messageCollection = 'message';

const messagesSchema = new mongoose.Schema({
    user: {
      type: String,
      require: true
    },
    message: {
      type: String,
      require: true
    },
    time: {
      type: Date,
      default: Date.now
    }
  });
  
  const messagesModel = mongoose.model(messageCollection, messagesSchema);
  
  export default messagesModel;