import { useStore } from "../store/useStore"
import { useAuth } from "../store/useAuth";

const HomePage = () => {

    const { accessToken } = useStore();
    const { signout } = useAuth();

    return (
        <div>
            {accessToken}
            <br />
            <button
                className="rounded border hover:border-purple-500"
                onClick={async () => {
                    const isSuccess = await signout();
                    if (!isSuccess) {
                        console.log('loi logout')
                    }
                }}
            >Logout</button>
        </div>
    )
}

export default HomePage
