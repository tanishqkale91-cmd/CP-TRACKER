export async function getLeetCodeSolved(username) {
    const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`
)

const data = await response.json();

return data;
}