import { getNewAccessToken } from "./tokenServices";
import { userEntry, userExit } from "./usersServices";

const services = {
    userEntry: userEntry,
    userExit: userExit,
    getNewAccessToken: getNewAccessToken
}

export default services;