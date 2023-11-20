import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/auth";

const page = async () => {
    const session = await getServerSession(authOptions);
    console.log(session);

    return <div> Great success! </div>;
}

export default page;