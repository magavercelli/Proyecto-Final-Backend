import { ERRORS } from '../enum/error.js';

export const errorHandler = (error, req, res, next) => {

    switch (error.code) {
        case ERRORS.PRODUCT_ERROR:
            res.send({
                status: "error",
                error: error.cause,
                message: error.message
            })

            break;

        case ERRORS.TICKET_ERROR:
            res.send({
                status: "error",
                error: error.cause,
                message: error.message
            })

            break;

        default:
            console.log(error)
            res.send({
                status: "error",
                message: "There was an error, contact customer service"
            })

            break;
    }
}