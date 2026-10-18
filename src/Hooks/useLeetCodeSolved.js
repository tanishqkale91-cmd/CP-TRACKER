import { useEffect, useState } from "react";
import { getLeetCodeSolved } from "../API/LeetCode";

function useLeetCodeSolved(username,search) {
    const [lcSolved, setLcSolved] = useState(null);

    useEffect(() => {
        if (!username || search === 0) {
            return;
        }

        async function fetchSolved() {
            try {
                const data = await getLeetCodeSolved(username);

                setLcSolved(data);
            } catch (error) {
                console.error("LC Solved Fetch Failed:", error);
            }
        }

        fetchSolved();
    }, [username, search]);

    return lcSolved;
}

export default useLeetCodeSolved;
